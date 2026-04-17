import { z } from 'zod';
import { haloClient } from '../client.js';
export function registerClientTools(server) {
    server.tool('halopsa_list_clients', 'List clients in HaloPSA. Supports name search and pagination.', {
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
        search: z.string().optional().describe('Filter by client name (partial match)'),
        include_inactive: z.boolean().optional().describe('Include inactive/archived clients'),
    }, async ({ page_no, page_size, search, include_inactive }) => {
        try {
            const params = {
                pageinate: true,
                page_no,
                page_size,
                includeactive: true,
            };
            if (search)
                params.search = search;
            if (include_inactive)
                params.includeinactive = true;
            const { data } = await haloClient.get('/Client', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return {
                content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
                isError: true,
            };
        }
    });
    server.tool('halopsa_get_client', 'Get full details for a specific HaloPSA client by its numeric ID.', {
        client_id: z.number().int().describe('HaloPSA client ID'),
        include_notes: z.boolean().optional().describe('Include client notes in the response'),
    }, async ({ client_id, include_notes }) => {
        try {
            const params = {};
            if (include_notes)
                params.includenotes = true;
            const { data } = await haloClient.get(`/Client/${client_id}`, { params });
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
//# sourceMappingURL=clients.js.map