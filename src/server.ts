import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';

import { ConstantContactClient } from './clients/constant-contact.js';
import { registerContactsTools } from './tools/contacts-tools.js';
import { registerCampaignsTools } from './tools/campaigns-tools.js';
import { registerListsTools } from './tools/lists-tools.js';
import { registerSegmentsTools } from './tools/segments-tools.js';
import { registerTemplatesTools } from './tools/templates-tools.js';
import { registerReportingTools } from './tools/reporting-tools.js';
import { registerLandingPagesTools } from './tools/landing-pages-tools.js';
import { registerSocialTools } from './tools/social-tools.js';
import { registerTagsTools } from './tools/tags-tools.js';

export class ConstantContactServer {
  private server: Server;
  private client: ConstantContactClient;
  private tools: Map<string, any> = new Map();

  constructor(accessToken: string) {
    this.server = new Server(
      {
        name: 'constant-contact-server',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.client = new ConstantContactClient({ accessToken });
    this.registerAllTools();
    this.setupHandlers();
  }

  private registerAllTools(): void {
    const toolGroups = [
      registerContactsTools(this.client),
      registerCampaignsTools(this.client),
      registerListsTools(this.client),
      registerSegmentsTools(this.client),
      registerTemplatesTools(this.client),
      registerReportingTools(this.client),
      registerLandingPagesTools(this.client),
      registerSocialTools(this.client),
      registerTagsTools(this.client)
    ];

    for (const group of toolGroups) {
      for (const [name, tool] of Object.entries(group)) {
        this.tools.set(name, tool);
      }
    }
  }

  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = Array.from(this.tools.entries()).map(([name, tool]) => ({
        name,
        description: tool.description,
        inputSchema: tool.parameters
      }));

      return { tools };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.tools.get(request.params.name);
      
      if (!tool) {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }

      try {
        const result = await tool.handler(request.params.arguments || {});
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('Constant Contact MCP Server running on stdio');
  }
}
