/**
 * Stdio entry point for Claude Desktop.
 *
 * IMPORTANT: dotenv must be loaded before any other local modules are imported,
 * because client.ts reads process.env at module initialisation time.
 * Static imports are hoisted in ES modules, so we use dynamic imports below
 * to guarantee the env file is loaded first.
 */
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// ── 1. Load .env before anything else touches process.env ──────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env') });
// ── 2. Dynamic imports — evaluated only after config() has run ─────────────
const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
const { registerTicketTools } = await import('./tools/tickets.js');
const { registerActionTools } = await import('./tools/actions.js');
const { registerClientTools } = await import('./tools/clients.js');
const { registerAgentTools } = await import('./tools/agents.js');
const { registerLookupTools } = await import('./tools/lookup.js');
const { registerReportTools } = await import('./tools/reports.js');
const { registerSiteTools } = await import('./tools/sites.js');
const { registerUserTools } = await import('./tools/users.js');
const { registerAssetTools } = await import('./tools/assets.js');
const { registerContractTools } = await import('./tools/contracts.js');
const { registerKbTools } = await import('./tools/kb.js');
const { registerInvoiceTools } = await import('./tools/invoices.js');
// ── 3. Wire up server ──────────────────────────────────────────────────────
const server = new McpServer({ name: 'mcp-halopsa', version: '1.0.0' });
registerTicketTools(server);
registerActionTools(server);
registerClientTools(server);
registerAgentTools(server);
registerLookupTools(server);
registerReportTools(server);
registerSiteTools(server);
registerUserTools(server);
registerAssetTools(server);
registerContractTools(server);
registerKbTools(server);
registerInvoiceTools(server);
const transport = new StdioServerTransport();
await server.connect(transport);
//# sourceMappingURL=stdio.js.map
