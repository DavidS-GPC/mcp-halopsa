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
    server.tool('halopsa_get_report', 'Get a HaloPSA report by ID. Use includedetails=true to return the full report definition and loadreport=true to execute the report and return its data.', {
        report_id: z.number().int().describe('Report ID'),
        includedetails: z.boolean().optional().describe('Include full report definition details'),
        loadreport: z.boolean().optional().describe('Execute the report and include the report data in the response'),
    }, async ({ report_id, includedetails, loadreport }) => {
        try {
            const params = {};
            if (includedetails) params.includedetails = true;
            if (loadreport) params.loadreport = true;
            const { data } = await haloClient.get(`/Report/${report_id}`, { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=reports.js.map
