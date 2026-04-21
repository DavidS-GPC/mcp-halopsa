import { z } from 'zod';
import { haloClient } from '../client.js';
export function registerSiteTools(server) {
    server.tool('halopsa_list_sites', 'List sites in HaloPSA. Sites are physical locations belonging to clients.', {
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
        client_id: z.number().int().optional().describe('Filter sites by client ID'),
        search: z.string().optional().describe('Filter by site name (partial match)'),
        include_inactive: z.boolean().optional().describe('Include inactive sites'),
    }, async ({ page_no, page_size, client_id, search, include_inactive }) => {
        try {
            const params = { pageinate: true, page_no, page_size };
            if (client_id) params.client_id = client_id;
            if (search) params.search = search;
            if (include_inactive) params.includeinactive = true;
            const { data } = await haloClient.get('/Site', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_get_site', 'Get full details for a specific HaloPSA site by its numeric ID.', {
        site_id: z.number().int().describe('HaloPSA site ID'),
    }, async ({ site_id }) => {
        try {
            const { data } = await haloClient.get(`/Site/${site_id}`);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=sites.js.map
