import { z } from 'zod';
import { haloClient } from '../client.js';
export function registerInvoiceTools(server) {
    server.tool('halopsa_list_invoices', 'List invoices in HaloPSA. Filter by client or date range.', {
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
        client_id: z.number().int().optional().describe('Filter invoices by client ID'),
        startdate: z.string().optional().describe('Start date filter (ISO 8601)'),
        enddate: z.string().optional().describe('End date filter (ISO 8601)'),
        unpaid_only: z.boolean().optional().describe('Only return unpaid invoices'),
    }, async ({ page_no, page_size, client_id, startdate, enddate, unpaid_only }) => {
        try {
            const params = { pageinate: true, page_no, page_size };
            if (client_id) params.client_id = client_id;
            if (startdate) params.startdate = startdate;
            if (enddate) params.enddate = enddate;
            if (unpaid_only) params.unpaid = true;
            const { data } = await haloClient.get('/Invoice', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_get_invoice', 'Get full details for a specific HaloPSA invoice by its numeric ID.', {
        invoice_id: z.number().int().describe('HaloPSA invoice ID'),
    }, async ({ invoice_id }) => {
        try {
            const { data } = await haloClient.get(`/Invoice/${invoice_id}`);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_list_quotes', 'List quotations/proposals in HaloPSA.', {
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
        client_id: z.number().int().optional().describe('Filter quotes by client ID'),
        search: z.string().optional().describe('Filter by quote title'),
    }, async ({ page_no, page_size, client_id, search }) => {
        try {
            const params = { pageinate: true, page_no, page_size };
            if (client_id) params.client_id = client_id;
            if (search) params.search = search;
            const { data } = await haloClient.get('/Quotation', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_get_quote', 'Get full details for a specific HaloPSA quotation by its numeric ID.', {
        quote_id: z.number().int().describe('HaloPSA quotation ID'),
    }, async ({ quote_id }) => {
        try {
            const { data } = await haloClient.get(`/Quotation/${quote_id}`);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_list_time_entries', 'List time entries/timesheets in HaloPSA. Useful for checking time logged against tickets or clients.', {
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
        client_id: z.number().int().optional().describe('Filter time entries by client ID'),
        ticket_id: z.number().int().optional().describe('Filter time entries for a specific ticket'),
        agent_id: z.number().int().optional().describe('Filter time entries by agent'),
        startdate: z.string().optional().describe('Start date filter (ISO 8601)'),
        enddate: z.string().optional().describe('End date filter (ISO 8601)'),
    }, async ({ page_no, page_size, client_id, ticket_id, agent_id, startdate, enddate }) => {
        try {
            const params = { pageinate: true, page_no, page_size };
            if (client_id) params.client_id = client_id;
            if (ticket_id) params.ticket_id = ticket_id;
            if (agent_id) params.agent_id = agent_id;
            if (startdate) params.startdate = startdate;
            if (enddate) params.enddate = enddate;
            const { data } = await haloClient.get('/TimeSheets', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=invoices.js.map
