import { z } from 'zod';
import { haloClient } from '../client.js';
export function registerTicketTools(server) {
    server.tool('halopsa_list_tickets', 'List tickets from HaloPSA with flexible filtering. Returns summary info for each ticket including status, priority, client, and assigned agent.', {
        page_no: z.number().int().min(1).default(1).describe('Page number (1-based)'),
        page_size: z.number().int().min(1).max(100).default(50).describe('Results per page (max 100)'),
        open_only: z.boolean().optional().describe('Only return open tickets'),
        closed_only: z.boolean().optional().describe('Only return closed tickets'),
        mine: z.boolean().optional().describe('Only return tickets assigned to the API user'),
        client_id: z.number().int().optional().describe('Filter by client ID'),
        agent_id: z.number().int().optional().describe('Filter by assigned agent ID'),
        status_id: z.number().int().optional().describe('Filter by status ID'),
        tickettype_id: z.number().int().optional().describe('Filter by ticket type ID'),
        team_id: z.number().int().optional().describe('Filter by team ID'),
        search: z.string().optional().describe('Search term to filter tickets'),
        startdate: z.string().optional().describe('Start date filter (ISO 8601)'),
        enddate: z.string().optional().describe('End date filter (ISO 8601)'),
    }, async ({ page_no, page_size, open_only, closed_only, mine, client_id, agent_id, status_id, tickettype_id, team_id, search, startdate, enddate }) => {
        try {
            const params = {
                pageinate: true,
                page_no,
                page_size,
            };
            if (open_only)
                params.open_only = true;
            if (closed_only)
                params.closed_only = true;
            if (mine)
                params.mine = true;
            if (client_id)
                params.client_id = client_id;
            if (agent_id)
                params.agent_id = agent_id;
            if (status_id)
                params.status_id = status_id;
            if (tickettype_id)
                params.tickettype_id = tickettype_id;
            if (team_id)
                params.team_id = team_id;
            if (search)
                params.search = search;
            if (startdate) {
                params.startdate = startdate;
                params.datesearch = 'dateoccurred';
            }
            if (enddate) {
                params.enddate = enddate;
                params.datesearch = 'dateoccurred';
            }
            const { data } = await haloClient.get('/Tickets', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return {
                content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
                isError: true,
            };
        }
    });
    server.tool('halopsa_get_ticket', 'Get full details for a specific HaloPSA ticket by its numeric ID, including all fields, custom fields, and SLA dates.', {
        ticket_id: z.number().int().describe('HaloPSA ticket ID'),
    }, async ({ ticket_id }) => {
        try {
            const { data } = await haloClient.get(`/Tickets/${ticket_id}`, {
                params: { include_customfields: true },
            });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return {
                content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
                isError: true,
            };
        }
    });
    server.tool('halopsa_create_ticket', 'Create a new ticket in HaloPSA. Returns the created ticket including its new ID.', {
        summary: z.string().describe('Ticket subject/summary line'),
        details: z.string().optional().describe('Full ticket description/body'),
        client_id: z.number().int().optional().describe('Client ID to associate this ticket with'),
        tickettype_id: z.number().int().optional().describe('Ticket type ID (use halopsa_list_ticket_types to find IDs)'),
        priority_id: z.number().int().optional().describe('Priority ID (use halopsa_list_priorities to find IDs)'),
        agent_id: z.number().int().optional().describe('Agent ID to assign the ticket to'),
        team_id: z.number().int().optional().describe('Team ID to assign the ticket to'),
        user_id: z.number().int().optional().describe('End-user ID to raise the ticket on behalf of'),
        site_id: z.number().int().optional().describe('Site ID'),
    }, async ({ summary, details, client_id, tickettype_id, priority_id, agent_id, team_id, user_id, site_id }) => {
        try {
            const ticket = { summary };
            if (details)
                ticket.details = details;
            if (client_id)
                ticket.client_id = client_id;
            if (tickettype_id)
                ticket.tickettype_id = tickettype_id;
            if (priority_id)
                ticket.priority_id = priority_id;
            if (agent_id)
                ticket.agent_id = agent_id;
            if (team_id)
                ticket.team_id = team_id;
            if (user_id)
                ticket.user_id = user_id;
            if (site_id)
                ticket.site_id = site_id;
            // HaloPSA POST accepts an array of objects
            const { data } = await haloClient.post('/Tickets', [ticket]);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return {
                content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
                isError: true,
            };
        }
    });
    server.tool('halopsa_update_ticket', 'Update an existing HaloPSA ticket. Only provide the fields you want to change — unset fields are left as-is.', {
        ticket_id: z.number().int().describe('HaloPSA ticket ID to update'),
        summary: z.string().optional().describe('New summary/subject'),
        status_id: z.number().int().optional().describe('New status ID'),
        priority_id: z.number().int().optional().describe('New priority ID'),
        agent_id: z.number().int().optional().describe('Reassign to this agent ID'),
        team_id: z.number().int().optional().describe('Reassign to this team ID'),
        onhold: z.boolean().optional().describe('Set on-hold status'),
        flagged: z.boolean().optional().describe('Set flagged status'),
    }, async ({ ticket_id, summary, status_id, priority_id, agent_id, team_id, onhold, flagged }) => {
        try {
            const update = { id: ticket_id };
            if (summary !== undefined)
                update.summary = summary;
            if (status_id !== undefined)
                update.status_id = status_id;
            if (priority_id !== undefined)
                update.priority_id = priority_id;
            if (agent_id !== undefined)
                update.agent_id = agent_id;
            if (team_id !== undefined)
                update.team_id = team_id;
            if (onhold !== undefined)
                update.onhold = onhold;
            if (flagged !== undefined)
                update.flagged = flagged;
            const { data } = await haloClient.post('/Tickets', [update]);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return {
                content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
                isError: true,
            };
        }
    });
}
//# sourceMappingURL=tickets.js.map