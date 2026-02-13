import type { ConstantContactClient } from '../clients/constant-contact.js';
import type { ContactList, Contact } from '../types/index.js';

export function registerListsTools(client: ConstantContactClient) {
  return {
    // List all contact lists
    lists_list: {
      description: 'Get all contact lists',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of lists to return'
          },
          include_count: {
            type: 'boolean',
            description: 'Include membership counts'
          },
          include_membership_count: {
            type: 'string',
            enum: ['active', 'all'],
            description: 'Type of membership count to include'
          }
        }
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.limit) params.limit = args.limit;
        if (args.include_count) params.include_count = args.include_count;
        if (args.include_membership_count) params.include_membership_count = args.include_membership_count;
        
        return await client.getPaginated<ContactList>('/contact_lists', params, args.limit);
      }
    },

    // Get list by ID
    lists_get: {
      description: 'Get a specific contact list by ID',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'List ID',
            required: true
          },
          include_membership_count: {
            type: 'string',
            enum: ['active', 'all'],
            description: 'Include membership count'
          }
        },
        required: ['list_id']
      },
      handler: async (args: any) => {
        const params = args.include_membership_count ? 
          { include_membership_count: args.include_membership_count } : undefined;
        return await client.get<ContactList>(`/contact_lists/${args.list_id}`, params);
      }
    },

    // Create list
    lists_create: {
      description: 'Create a new contact list',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'List name',
            required: true
          },
          description: {
            type: 'string',
            description: 'List description'
          },
          favorite: {
            type: 'boolean',
            description: 'Mark as favorite list'
          }
        },
        required: ['name']
      },
      handler: async (args: any) => {
        const listData: Partial<ContactList> = {
          name: args.name
        };
        
        if (args.description) listData.description = args.description;
        if (args.favorite !== undefined) listData.favorite = args.favorite;
        
        return await client.post<ContactList>('/contact_lists', listData);
      }
    },

    // Update list
    lists_update: {
      description: 'Update an existing contact list',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'List ID',
            required: true
          },
          name: {
            type: 'string',
            description: 'New list name'
          },
          description: {
            type: 'string',
            description: 'New list description'
          },
          favorite: {
            type: 'boolean',
            description: 'Mark as favorite'
          }
        },
        required: ['list_id']
      },
      handler: async (args: any) => {
        const { list_id, ...updates } = args;
        return await client.put<ContactList>(`/contact_lists/${list_id}`, updates);
      }
    },

    // Delete list
    lists_delete: {
      description: 'Delete a contact list',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'List ID to delete',
            required: true
          }
        },
        required: ['list_id']
      },
      handler: async (args: any) => {
        await client.delete(`/contact_lists/${args.list_id}`);
        return { success: true, message: `List ${args.list_id} deleted` };
      }
    },

    // Add contacts to list
    lists_add_contacts: {
      description: 'Add one or more contacts to a list',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'List ID',
            required: true
          },
          contact_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of contact IDs to add',
            required: true
          }
        },
        required: ['list_id', 'contact_ids']
      },
      handler: async (args: any) => {
        const results = [];
        
        for (const contactId of args.contact_ids) {
          try {
            // Get contact, add list to memberships, update
            const contact = await client.get<Contact>(`/contacts/${contactId}`);
            const memberships = contact.list_memberships || [];
            
            if (!memberships.includes(args.list_id)) {
              memberships.push(args.list_id);
              await client.put(`/contacts/${contactId}`, {
                list_memberships: memberships
              });
              results.push({ contact_id: contactId, success: true });
            } else {
              results.push({ contact_id: contactId, success: true, message: 'Already member' });
            }
          } catch (error: any) {
            results.push({ contact_id: contactId, success: false, error: error.message });
          }
        }
        
        return { results };
      }
    },

    // Remove contacts from list
    lists_remove_contacts: {
      description: 'Remove contacts from a list',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'List ID',
            required: true
          },
          contact_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of contact IDs to remove',
            required: true
          }
        },
        required: ['list_id', 'contact_ids']
      },
      handler: async (args: any) => {
        const results = [];
        
        for (const contactId of args.contact_ids) {
          try {
            const contact = await client.get<Contact>(`/contacts/${contactId}`);
            const memberships = (contact.list_memberships || []).filter(
              (id) => id !== args.list_id
            );
            
            await client.put(`/contacts/${contactId}`, {
              list_memberships: memberships
            });
            results.push({ contact_id: contactId, success: true });
          } catch (error: any) {
            results.push({ contact_id: contactId, success: false, error: error.message });
          }
        }
        
        return { results };
      }
    },

    // Get list membership
    lists_get_membership: {
      description: 'Get all contacts that are members of a list',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'List ID',
            required: true
          },
          limit: {
            type: 'number',
            description: 'Maximum number of contacts to return'
          },
          status: {
            type: 'string',
            enum: ['all', 'active', 'unsubscribed'],
            description: 'Filter by contact status'
          }
        },
        required: ['list_id']
      },
      handler: async (args: any) => {
        const params: any = {
          list_ids: args.list_id
        };
        
        if (args.status) params.status = args.status;
        if (args.limit) params.limit = args.limit;
        
        const contacts = await client.getPaginated<Contact>('/contacts', params, args.limit);
        return { contacts, count: contacts.length };
      }
    },

    // Get list statistics
    lists_get_stats: {
      description: 'Get statistics about a list',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'List ID',
            required: true
          }
        },
        required: ['list_id']
      },
      handler: async (args: any) => {
        const list = await client.get<ContactList>(
          `/contact_lists/${args.list_id}?include_membership_count=all`
        );
        
        // Get contacts to calculate additional stats
        const contacts = await client.getPaginated<Contact>(
          '/contacts',
          { list_ids: args.list_id, status: 'all' }
        );
        
        const activeCount = contacts.filter(c => c.permission_to_send === 'implicit').length;
        const unsubscribedCount = contacts.filter(c => c.permission_to_send === 'unsubscribed').length;
        
        return {
          list_id: args.list_id,
          name: list.name,
          total_members: list.membership_count || 0,
          active_members: activeCount,
          unsubscribed_members: unsubscribedCount
        };
      }
    }
  };
}
