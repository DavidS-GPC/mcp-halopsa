import { haloClient } from '../client.js';
export function registerLookupTools(server) {
    server.tool('halopsa_list_priorities', 'List all ticket priorities in HaloPSA. Use the returned IDs when creating or updating tickets.', {}, async () => {
        try {
            const { data } = await haloClient.get('/Priority');
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_list_ticket_types', 'List all ticket types in HaloPSA (e.g. Incident, Service Request, Change). Use the returned IDs when creating tickets.', {}, async () => {
        try {
            const { data } = await haloClient.get('/TicketType');
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_list_statuses', 'List all ticket statuses in HaloPSA (e.g. New, In Progress, Waiting, Resolved). Use the returned IDs when filtering or updating tickets.', {}, async () => {
        try {
            const { data } = await haloClient.get('/Status');
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_list_teams', 'List all agent teams in HaloPSA. Use the returned IDs when creating or assigning tickets.', {}, async () => {
        try {
            const { data } = await haloClient.get('/Team');
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_list_sla_policies', 'List all SLA policies configured in HaloPSA.', {}, async () => {
        try {
            const { data } = await haloClient.get('/SLA');
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=lookup.js.map
