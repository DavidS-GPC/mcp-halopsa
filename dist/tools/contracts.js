import { z } from 'zod';
import { haloClient } from '../client.js';
export function registerContractTools(server) {
    server.tool('halopsa_list_contracts', 'List MSP contracts/agreements in HaloPSA. Useful for checking what services a client is covered for and renewal dates.', {
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
        client_id: z.number().int().optional().describe('Filter contracts by client ID'),
        search: z.string().optional().describe('Filter by contract name'),
        include_inactive: z.boolean().optional().describe('Include expired or inactive contracts'),
    }, async ({ page_no, page_size, client_id, search, include_inactive }) => {
        try {
            const params = { pageinate: true, page_no, page_size };
            if (client_id) params.client_id = client_id;
            if (search) params.search = search;
            if (include_inactive) params.includeinactive = true;
            const { data } = await haloClient.get('/Contract', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_get_contract', 'Get full details for a specific HaloPSA contract by its numeric ID.', {
        contract_id: z.number().int().describe('HaloPSA contract ID'),
    }, async ({ contract_id }) => {
        try {
            const { data } = await haloClient.get(`/Contract/${contract_id}`);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=contracts.js.map
