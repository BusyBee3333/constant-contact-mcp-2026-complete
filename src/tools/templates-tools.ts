import type { ConstantContactClient } from '../clients/constant-contact.js';
import type { EmailTemplate } from '../types/index.js';

export function registerTemplatesTools(client: ConstantContactClient) {
  return {
    // List templates
    templates_list: {
      description: 'List all email templates',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of templates to return'
          },
          type: {
            type: 'string',
            enum: ['custom', 'system'],
            description: 'Filter by template type'
          }
        }
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.limit) params.limit = args.limit;
        if (args.type) params.type = args.type;
        
        return await client.getPaginated<EmailTemplate>('/emails/templates', params, args.limit);
      }
    },

    // Get template by ID
    templates_get: {
      description: 'Get a specific email template by ID',
      parameters: {
        type: 'object',
        properties: {
          template_id: {
            type: 'string',
            description: 'Template ID',
            required: true
          }
        },
        required: ['template_id']
      },
      handler: async (args: any) => {
        return await client.get<EmailTemplate>(`/emails/templates/${args.template_id}`);
      }
    }
  };
}
