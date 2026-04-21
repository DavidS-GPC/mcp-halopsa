import { z } from 'zod';
import { haloClient } from '../client.js';
export function registerUserTools(server) {
    server.tool('halopsa_list_users', 'List end-users (contacts) in HaloPSA. Useful for finding user IDs when raising tickets on someone\'s behalf.', {
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
        client_id: z.number().int().optional().describe('Filter users by client ID'),
        search: z.string().optional().describe('Filter by name or email (partial match)'),
        include_inactive: z.boolean().optional().describe('Include inactive/disabled users'),
    }, async ({ page_no, page_size, client_id, search, include_inactive }) => {
        try {
            const params = { pageinate: true, page_no, page_size, includeactive: true };
            if (client_id) params.client_id = client_id;
            if (search) params.search = search;
            if (include_inactive) params.includeinactive = true;
            const { data } = await haloClient.get('/Users', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_get_user', 'Get full details for a specific HaloPSA end-user by their numeric ID.', {
        user_id: z.number().int().describe('HaloPSA user ID'),
    }, async ({ user_id }) => {
        try {
            const { data } = await haloClient.get(`/Users/${user_id}`);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=users.js.map
