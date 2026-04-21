import { z } from 'zod';
import { haloClient } from '../client.js';
export function registerAssetTools(server) {
    server.tool('halopsa_list_assets', 'List assets (CIs / configuration items) in HaloPSA.', {
        page_no: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(100).default(50),
        client_id: z.number().int().optional().describe('Filter assets by client ID'),
        site_id: z.number().int().optional().describe('Filter assets by site ID'),
        search: z.string().optional().describe('Filter by asset name or serial number (partial match)'),
        assettype_id: z.number().int().optional().describe('Filter by asset type ID'),
        include_inactive: z.boolean().optional().describe('Include inactive/retired assets'),
    }, async ({ page_no, page_size, client_id, site_id, search, assettype_id, include_inactive }) => {
        try {
            const params = { pageinate: true, page_no, page_size };
            if (client_id) params.client_id = client_id;
            if (site_id) params.site_id = site_id;
            if (search) params.search = search;
            if (assettype_id) params.assettype_id = assettype_id;
            if (include_inactive) params.includeinactive = true;
            const { data } = await haloClient.get('/Asset', { params });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_get_asset', 'Get full details for a specific HaloPSA asset/CI by its numeric ID, including custom fields.', {
        asset_id: z.number().int().describe('HaloPSA asset ID'),
    }, async ({ asset_id }) => {
        try {
            const { data } = await haloClient.get(`/Asset/${asset_id}`, {
                params: { include_customfields: true },
            });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
    server.tool('halopsa_list_asset_types', 'List all asset types in HaloPSA. Use the returned IDs when filtering assets.', {}, async () => {
        try {
            const { data } = await haloClient.get('/AssetType');
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        }
        catch (e) {
            return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=assets.js.map
