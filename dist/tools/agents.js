import { z } from 'zod';
import { haloClient } from '../client.js';
export function registerAgentTools(server) {
    server.tool('halopsa_list_agents', 'List agents (technicians) in HaloPSA. Useful for finding agent IDs when assigning tickets.', {
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
        search: z.string().optional().describe('Filter by agent name (partial match)'),
        include_inactive: z.boolean().optional().describe('Include disabled/inactive agents'),
        include_status: z.boolean().optional().describe('Include online/availability status'),
    }, async ({ page_no, page_size, search, include_inactive, include_status }) => {
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
                params.includedisabled = true;
            if (include_status)
                params.includestatus = true;
            const { data } = await haloClient.get('/Agent', { params });
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
//# sourceMappingURL=agents.js.map