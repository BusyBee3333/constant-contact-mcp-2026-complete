import type { ConstantContactClient } from '../clients/constant-contact.js';
import type { Tag } from '../types/index.js';

export function registerTagsTools(client: ConstantContactClient) {
  return {
    // List tags
    tags_list: {
      description: 'List all contact tags',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of tags to return'
          }
        }
      },
      handler: async (args: any) => {
        const params = args.limit ? { limit: args.limit } : undefined;
        return await client.getPaginated<Tag>('/contact_tags', params, args.limit);
      }
    },

    // Get tag by ID
    tags_get: {
      description: 'Get a specific tag by ID',
      parameters: {
        type: 'object',
        properties: {
          tag_id: {
            type: 'string',
            description: 'Tag ID',
            required: true
          }
        },
        required: ['tag_id']
      },
      handler: async (args: any) => {
        return await client.get<Tag>(`/contact_tags/${args.tag_id}`);
      }
    },

    // Create tag
    tags_create: {
      description: 'Create a new contact tag',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Tag name',
            required: true
          },
          tag_source: {
            type: 'string',
            description: 'Source of the tag (e.g., "Contact", "Campaign")'
          }
        },
        required: ['name']
      },
      handler: async (args: any) => {
        const tagData: Partial<Tag> = {
          name: args.name
        };
        
        if (args.tag_source) tagData.tag_source = args.tag_source;
        
        return await client.post<Tag>('/contact_tags', tagData);
      }
    },

    // Update tag
    tags_update: {
      description: 'Update an existing tag',
      parameters: {
        type: 'object',
        properties: {
          tag_id: {
            type: 'string',
            description: 'Tag ID',
            required: true
          },
          name: {
            type: 'string',
            description: 'New tag name',
            required: true
          }
        },
        required: ['tag_id', 'name']
      },
      handler: async (args: any) => {
        const { tag_id, ...updates } = args;
        return await client.put<Tag>(`/contact_tags/${tag_id}`, updates);
      }
    },

    // Delete tag
    tags_delete: {
      description: 'Delete a tag',
      parameters: {
        type: 'object',
        properties: {
          tag_id: {
            type: 'string',
            description: 'Tag ID to delete',
            required: true
          }
        },
        required: ['tag_id']
      },
      handler: async (args: any) => {
        await client.delete(`/contact_tags/${args.tag_id}`);
        return { success: true, message: `Tag ${args.tag_id} deleted` };
      }
    },

    // Get tag usage
    tags_get_usage: {
      description: 'Get contact count and usage statistics for a tag',
      parameters: {
        type: 'object',
        properties: {
          tag_id: {
            type: 'string',
            description: 'Tag ID',
            required: true
          }
        },
        required: ['tag_id']
      },
      handler: async (args: any) => {
        const tag = await client.get<Tag>(`/contact_tags/${args.tag_id}`);
        
        return {
          tag_id: args.tag_id,
          name: tag.name,
          contacts_count: tag.contacts_count || 0,
          created_at: tag.created_at
        };
      }
    }
  };
}
