import { z } from 'zod';
import { haloClient } from '../client.js';
export function registerKbTools(server) {
    server.tool('halopsa_list_kb_articles', 'List knowledge base articles in HaloPSA.', {
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
        search: z.string().optional().describe('Filter articles by title or content'),
        tickettype_id: z.number().int().optional().describe('Filter articles by ticket type'),
    }, async ({ page_no, page_size, search, tickettype_id }) => {
        try {
            const params = { pageinate: true, page_no, page_size };
            if (search) params.search = search;
            if (tickettype_id) params.tickettype_id = tickettype_id;
            const { data } = await haloClient.get('/KBArticle', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_get_kb_article', 'Get the full content of a specific HaloPSA knowledge base article by its ID.', {
        article_id: z.number().int().describe('KB article ID'),
    }, async ({ article_id }) => {
        try {
            const { data } = await haloClient.get(`/KBArticle/${article_id}`);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=kb.js.map
