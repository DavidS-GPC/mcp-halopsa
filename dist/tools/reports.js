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
    server.tool('halopsa_get_report', 'Get the definition/details of a specific HaloPSA report by its ID.', {
        report_id: z.number().int().describe('Report ID'),
    }, async ({ report_id }) => {
        try {
            const { data } = await haloClient.get(`/Report/${report_id}`);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_run_report', 'Run a HaloPSA report and return the results. Use halopsa_list_reports to find report IDs.', {
        report_id: z.number().int().describe('Report ID to run'),
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
        startdate: z.string().optional().describe('Start date filter (ISO 8601, e.g. 2024-01-01)'),
        enddate: z.string().optional().describe('End date filter (ISO 8601, e.g. 2024-12-31)'),
        client_id: z.number().int().optional().describe('Filter report results by client ID'),
    }, async ({ report_id, page_no, page_size, startdate, enddate, client_id }) => {
        try {
            const params = { pageinate: true, page_no, page_size };
            if (startdate) params.startdate = startdate;
            if (enddate) params.enddate = enddate;
            if (client_id) params.client_id = client_id;
            const { data } = await haloClient.get(`/Report/${report_id}/results`, { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=reports.js.map
