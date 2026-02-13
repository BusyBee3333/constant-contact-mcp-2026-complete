import type { ConstantContactClient } from '../clients/constant-contact.js';
import type { LandingPage } from '../types/index.js';

export function registerLandingPagesTools(client: ConstantContactClient) {
  return {
    // List landing pages
    landing_pages_list: {
      description: 'List all landing pages',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of landing pages to return'
          },
          status: {
            type: 'string',
            enum: ['DRAFT', 'ACTIVE', 'DELETED'],
            description: 'Filter by landing page status'
          }
        }
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.limit) params.limit = args.limit;
        if (args.status) params.status = args.status;
        
        return await client.getPaginated<LandingPage>('/landing_pages', params, args.limit);
      }
    },

    // Get landing page by ID
    landing_pages_get: {
      description: 'Get a specific landing page by ID',
      parameters: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'Landing page ID',
            required: true
          }
        },
        required: ['page_id']
      },
      handler: async (args: any) => {
        return await client.get<LandingPage>(`/landing_pages/${args.page_id}`);
      }
    },

    // Create landing page
    landing_pages_create: {
      description: 'Create a new landing page',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Landing page name',
            required: true
          },
          description: {
            type: 'string',
            description: 'Landing page description'
          },
          html_content: {
            type: 'string',
            description: 'HTML content for the landing page',
            required: true
          }
        },
        required: ['name', 'html_content']
      },
      handler: async (args: any) => {
        const pageData: Partial<LandingPage> = {
          name: args.name,
          html_content: args.html_content,
          status: 'DRAFT'
        };
        
        if (args.description) pageData.description = args.description;
        
        return await client.post<LandingPage>('/landing_pages', pageData);
      }
    },

    // Update landing page
    landing_pages_update: {
      description: 'Update an existing landing page',
      parameters: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'Landing page ID',
            required: true
          },
          name: {
            type: 'string',
            description: 'New page name'
          },
          description: {
            type: 'string',
            description: 'New page description'
          },
          html_content: {
            type: 'string',
            description: 'Updated HTML content'
          },
          status: {
            type: 'string',
            enum: ['DRAFT', 'ACTIVE'],
            description: 'Page status'
          }
        },
        required: ['page_id']
      },
      handler: async (args: any) => {
        const { page_id, ...updates } = args;
        return await client.put<LandingPage>(`/landing_pages/${page_id}`, updates);
      }
    },

    // Delete landing page
    landing_pages_delete: {
      description: 'Delete a landing page',
      parameters: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'Landing page ID to delete',
            required: true
          }
        },
        required: ['page_id']
      },
      handler: async (args: any) => {
        await client.delete(`/landing_pages/${args.page_id}`);
        return { success: true, message: `Landing page ${args.page_id} deleted` };
      }
    },

    // Publish landing page
    landing_pages_publish: {
      description: 'Publish a draft landing page',
      parameters: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'Landing page ID',
            required: true
          }
        },
        required: ['page_id']
      },
      handler: async (args: any) => {
        return await client.put<LandingPage>(`/landing_pages/${args.page_id}`, {
          status: 'ACTIVE'
        });
      }
    },

    // Get landing page stats
    landing_pages_get_stats: {
      description: 'Get performance statistics for a landing page',
      parameters: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'Landing page ID',
            required: true
          }
        },
        required: ['page_id']
      },
      handler: async (args: any) => {
        return await client.get(`/reports/landing_pages/${args.page_id}/stats`);
      }
    }
  };
}
