import { z } from 'zod';
import { haloClient } from '../client.js';
export function registerActionTools(server) {
    server.tool('halopsa_get_ticket_actions', 'Get the action history (notes, emails, updates) for a specific HaloPSA ticket.', {
        ticket_id: z.number().int().describe('HaloPSA ticket ID'),
        agent_only: z.boolean().optional().describe('Only return agent actions (excludes end-user replies)'),
        exclude_private: z.boolean().optional().describe('Exclude private/internal notes'),
        count: z.number().int().min(1).max(200).default(50).describe('Number of actions to return'),
    }, async ({ ticket_id, agent_only, exclude_private, count }) => {
        try {
            const params = { ticket_id, count };
            if (agent_only)
                params.agentonly = true;
            if (exclude_private)
                params.excludeprivate = true;
            const { data } = await haloClient.get('/Actions', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return {
                content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
                isError: true,
            };
        }
    });
    server.tool('halopsa_add_note', 'Add a note or update to an existing HaloPSA ticket. Use this to log work, communicate with the client, or record progress.', {
        ticket_id: z.number().int().describe('HaloPSA ticket ID to add the note to'),
        note: z.string().describe('The note text to add to the ticket'),
        outcome: z.string().optional().describe('Action outcome/type label (e.g. "Note", "Update"). Defaults to a standard note.'),
        is_private: z.boolean().optional().describe('Mark the note as private/internal (not visible to end user)'),
        timetaken: z.number().optional().describe('Time spent in hours (e.g. 0.5 for 30 minutes)'),
    }, async ({ ticket_id, note, outcome, is_private, timetaken }) => {
        try {
            const action = {
                ticket_id,
                note,
            };
            if (outcome)
                action.outcome = outcome;
            if (is_private !== undefined)
                action.sendemail = !is_private;
            if (timetaken !== undefined)
                action.timetaken = timetaken;
            const { data } = await haloClient.post('/Actions', [action]);
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
//# sourceMappingURL=actions.js.map