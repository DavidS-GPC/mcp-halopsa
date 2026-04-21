import { z } from 'zod';
import { haloClient } from '../client.js';
export function registerReportTools(server) {
    server.tool('halopsa_list_reports', 'List all available reports in HaloPSA.', {
        search: z.string().optional().describe('Filter reports by name'),
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
    }, async ({ search, page_no, page_size }) => {
        try {
            const params = { pageinate: true, page_no, page_size };
            if (search) params.search = search;
            const { data } = await haloClient.get('/Report', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_get_report', 'Get a HaloPSA report by ID. Set include_data to true to also load the report results, with optional date range and client filters.', {
        report_id: z.number().int().describe('Report ID'),
        include_data: z.boolean().optional().describe('Set to true to load the report results alongside the definition'),
        page_no: z.number().int().min(1).default(1).describe('Results page number (used when include_data is true)'),
        page_size: z.number().int().min(1).max(100).default(50).describe('Results per page (used when include_data is true)'),
        startdate: z.string().optional().describe('Start date filter for results (ISO 8601, e.g. 2024-01-01)'),
        enddate: z.string().optional().describe('End date filter for results (ISO 8601, e.g. 2024-12-31)'),
        client_id: z.number().int().optional().describe('Filter results by client ID'),
    }, async ({ report_id, include_data, page_no, page_size, startdate, enddate, client_id }) => {
        try {
            const { data: definition } = await haloClient.get(`/Report/${report_id}`);
            if (!include_data) {
                return { content: [{ type: 'text', text: JSON.stringify(definition, null, 2) }] };
            }
            const params = { pageinate: true, page_no, page_size };
            if (startdate) params.startdate = startdate;
            if (enddate) params.enddate = enddate;
            if (client_id) params.client_id = client_id;
            const { data: results } = await haloClient.get(`/Report/${report_id}/results`, { params });
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({ definition, results }, null, 2),
                }],
            };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=reports.js.map
