import type { ConstantContactClient } from '../clients/constant-contact.js';
import type { Segment } from '../types/index.js';

export function registerSegmentsTools(client: ConstantContactClient) {
  return {
    // List segments
    segments_list: {
      description: 'List all contact segments',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of segments to return'
          }
        }
      },
      handler: async (args: any) => {
        const params = args.limit ? { limit: args.limit } : undefined;
        return await client.getPaginated<Segment>('/segments', params, args.limit);
      }
    },

    // Get segment by ID
    segments_get: {
      description: 'Get a specific segment by ID',
      parameters: {
        type: 'object',
        properties: {
          segment_id: {
            type: 'string',
            description: 'Segment ID',
            required: true
          }
        },
        required: ['segment_id']
      },
      handler: async (args: any) => {
        return await client.get<Segment>(`/segments/${args.segment_id}`);
      }
    },

    // Create segment
    segments_create: {
      description: 'Create a new contact segment with criteria',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Segment name',
            required: true
          },
          segment_criteria: {
            type: 'string',
            description: 'JSON string defining segment criteria (e.g., {"field":"email_domain","operator":"equals","value":"gmail.com"})',
            required: true
          }
        },
        required: ['name', 'segment_criteria']
      },
      handler: async (args: any) => {
        let criteria;
        try {
          criteria = typeof args.segment_criteria === 'string' 
            ? JSON.parse(args.segment_criteria) 
            : args.segment_criteria;
        } catch {
          throw new Error('Invalid segment_criteria JSON');
        }
        
        const segmentData = {
          name: args.name,
          segment_criteria: criteria
        };
        
        return await client.post<Segment>('/segments', segmentData);
      }
    },

    // Update segment
    segments_update: {
      description: 'Update an existing segment',
      parameters: {
        type: 'object',
        properties: {
          segment_id: {
            type: 'string',
            description: 'Segment ID',
            required: true
          },
          name: {
            type: 'string',
            description: 'New segment name'
          },
          segment_criteria: {
            type: 'string',
            description: 'JSON string of updated segment criteria'
          }
        },
        required: ['segment_id']
      },
      handler: async (args: any) => {
        const { segment_id, ...updates } = args;
        
        if (updates.segment_criteria) {
          try {
            updates.segment_criteria = typeof updates.segment_criteria === 'string'
              ? JSON.parse(updates.segment_criteria)
              : updates.segment_criteria;
          } catch {
            throw new Error('Invalid segment_criteria JSON');
          }
        }
        
        return await client.put<Segment>(`/segments/${segment_id}`, updates);
      }
    },

    // Delete segment
    segments_delete: {
      description: 'Delete a segment',
      parameters: {
        type: 'object',
        properties: {
          segment_id: {
            type: 'string',
            description: 'Segment ID to delete',
            required: true
          }
        },
        required: ['segment_id']
      },
      handler: async (args: any) => {
        await client.delete(`/segments/${args.segment_id}`);
        return { success: true, message: `Segment ${args.segment_id} deleted` };
      }
    },

    // Get segment contacts
    segments_get_contacts: {
      description: 'Get all contacts in a segment',
      parameters: {
        type: 'object',
        properties: {
          segment_id: {
            type: 'string',
            description: 'Segment ID',
            required: true
          },
          limit: {
            type: 'number',
            description: 'Maximum number of contacts to return'
          }
        },
        required: ['segment_id']
      },
      handler: async (args: any) => {
        const params: any = {
          segment_ids: args.segment_id
        };
        
        if (args.limit) params.limit = args.limit;
        
        const contacts = await client.getPaginated(
          '/contacts',
          params,
          args.limit
        );
        
        return { contacts, count: contacts.length };
      }
    }
  };
}
