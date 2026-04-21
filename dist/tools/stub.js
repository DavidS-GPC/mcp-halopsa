import { z } from 'zod';
const STUB_MSG = '[STUB] HaloPSA integration is not yet implemented. ' +
    'Provide the HaloPSA API reference JSON to complete this server.';
export function registerStubTools(server) {
    server.tool('halopsa_list_tickets', '[STUB] List tickets from HaloPSA. Implementation pending API reference.', {
        status: z.enum(['open', 'closed', 'all']).default('open'),
        page: z.number().int().min(1).default(1),
    }, async () => ({ content: [{ type: 'text', text: STUB_MSG }] }));
    server.tool('halopsa_get_ticket', '[STUB] Get a HaloPSA ticket by ID. Implementation pending API reference.', {
        ticket_id: z.number().int().describe('HaloPSA ticket ID'),
    }, async () => ({ content: [{ type: 'text', text: STUB_MSG }] }));
    server.tool('halopsa_create_ticket', '[STUB] Create a new ticket in HaloPSA. Implementation pending API reference.', {
        summary: z.string().describe('Ticket subject/summary'),
        details: z.string().optional().describe('Ticket description/body'),
        client_id: z.number().int().optional().describe('HaloPSA client ID'),
        priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    }, async () => ({ content: [{ type: 'text', text: STUB_MSG }] }));
    server.tool('halopsa_list_clients', '[STUB] List clients in HaloPSA. Implementation pending API reference.', {
        page: z.number().int().min(1).default(1),
    }, async () => ({ content: [{ type: 'text', text: STUB_MSG }] }));
    server.tool('halopsa_update_ticket', '[STUB] Update an existing HaloPSA ticket. Implementation pending API reference.', {
        ticket_id: z.number().int(),
        status: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
        note: z.string().optional().describe('Add a note/update to the ticket'),
    }, async () => ({ content: [{ type: 'text', text: STUB_MSG }] }));
}
//# sourceMappingURL=stub.js.map