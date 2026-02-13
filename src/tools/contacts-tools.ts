import type { ConstantContactClient } from '../clients/constant-contact.js';
import type { Contact, ContactActivity, Tag } from '../types/index.js';

export function registerContactsTools(client: ConstantContactClient) {
  return {
    // List contacts
    contacts_list: {
      description: 'List all contacts with optional filters',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of contacts to return (default 50)'
          },
          email: {
            type: 'string',
            description: 'Filter by email address'
          },
          status: {
            type: 'string',
            enum: ['all', 'active', 'unsubscribed', 'removed', 'non_subscriber'],
            description: 'Filter by contact status'
          },
          list_ids: {
            type: 'string',
            description: 'Comma-separated list IDs to filter by'
          },
          include_count: {
            type: 'boolean',
            description: 'Include total count in response'
          }
        }
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.limit) params.limit = args.limit;
        if (args.email) params.email = args.email;
        if (args.status) params.status = args.status;
        if (args.list_ids) params.list_ids = args.list_ids;
        if (args.include_count) params.include_count = args.include_count;
        
        const contacts = await client.getPaginated<Contact>('/contacts', params, args.limit);
        return { contacts, count: contacts.length };
      }
    },

    // Get contact by ID
    contacts_get: {
      description: 'Get a specific contact by contact ID',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'string',
            description: 'Unique contact identifier',
            required: true
          },
          include: {
            type: 'string',
            description: 'Comma-separated list of fields to include (e.g., "custom_fields,list_memberships,taggings")'
          }
        },
        required: ['contact_id']
      },
      handler: async (args: any) => {
        const params = args.include ? { include: args.include } : undefined;
        return await client.get<Contact>(`/contacts/${args.contact_id}`, params);
      }
    },

    // Create contact
    contacts_create: {
      description: 'Create a new contact',
      parameters: {
        type: 'object',
        properties: {
          email_address: {
            type: 'string',
            description: 'Contact email address',
            required: true
          },
          first_name: { type: 'string', description: 'First name' },
          last_name: { type: 'string', description: 'Last name' },
          job_title: { type: 'string', description: 'Job title' },
          company_name: { type: 'string', description: 'Company name' },
          phone_number: { type: 'string', description: 'Phone number' },
          list_memberships: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of list IDs to add contact to'
          },
          street_address: { type: 'string', description: 'Street address' },
          city: { type: 'string', description: 'City' },
          state: { type: 'string', description: 'State/Province' },
          postal_code: { type: 'string', description: 'Postal/ZIP code' },
          country: { type: 'string', description: 'Country' }
        },
        required: ['email_address']
      },
      handler: async (args: any) => {
        const contact: Partial<Contact> = {
          email_address: args.email_address,
          first_name: args.first_name,
          last_name: args.last_name,
          job_title: args.job_title,
          company_name: args.company_name,
          list_memberships: args.list_memberships || []
        };

        if (args.phone_number) {
          contact.phone_numbers = [{ phone_number: args.phone_number }];
        }

        if (args.street_address || args.city || args.state || args.postal_code || args.country) {
          contact.street_addresses = [{
            street: args.street_address,
            city: args.city,
            state: args.state,
            postal_code: args.postal_code,
            country: args.country
          }];
        }

        return await client.post<Contact>('/contacts', contact);
      }
    },

    // Update contact
    contacts_update: {
      description: 'Update an existing contact',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'string',
            description: 'Unique contact identifier',
            required: true
          },
          email_address: { type: 'string', description: 'Email address' },
          first_name: { type: 'string', description: 'First name' },
          last_name: { type: 'string', description: 'Last name' },
          job_title: { type: 'string', description: 'Job title' },
          company_name: { type: 'string', description: 'Company name' },
          phone_number: { type: 'string', description: 'Phone number' },
          list_memberships: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of list IDs'
          }
        },
        required: ['contact_id']
      },
      handler: async (args: any) => {
        const { contact_id, ...updates } = args;
        if (args.phone_number && !updates.phone_numbers) {
          updates.phone_numbers = [{ phone_number: args.phone_number }];
          delete updates.phone_number;
        }
        return await client.put<Contact>(`/contacts/${contact_id}`, updates);
      }
    },

    // Delete contact
    contacts_delete: {
      description: 'Delete a contact by ID',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'string',
            description: 'Unique contact identifier',
            required: true
          }
        },
        required: ['contact_id']
      },
      handler: async (args: any) => {
        await client.delete(`/contacts/${args.contact_id}`);
        return { success: true, message: `Contact ${args.contact_id} deleted` };
      }
    },

    // Search contacts
    contacts_search: {
      description: 'Search contacts by various criteria',
      parameters: {
        type: 'object',
        properties: {
          email: { type: 'string', description: 'Search by email address' },
          first_name: { type: 'string', description: 'Search by first name' },
          last_name: { type: 'string', description: 'Search by last name' },
          list_id: { type: 'string', description: 'Filter by list membership' },
          limit: { type: 'number', description: 'Max results' }
        }
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.email) params.email = args.email;
        if (args.first_name) params.first_name = args.first_name;
        if (args.last_name) params.last_name = args.last_name;
        if (args.list_id) params.list_ids = args.list_id;
        
        return await client.getPaginated<Contact>('/contacts', params, args.limit);
      }
    },

    // List contact tags
    contacts_list_tags: {
      description: 'Get all tags assigned to a contact',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'string',
            description: 'Contact ID',
            required: true
          }
        },
        required: ['contact_id']
      },
      handler: async (args: any) => {
        const contact = await client.get<Contact>(`/contacts/${args.contact_id}?include=taggings`);
        return { tags: contact.taggings || [] };
      }
    },

    // Add tag to contact
    contacts_add_tag: {
      description: 'Add a tag to a contact',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'string',
            description: 'Contact ID',
            required: true
          },
          tag_id: {
            type: 'string',
            description: 'Tag ID to add',
            required: true
          }
        },
        required: ['contact_id', 'tag_id']
      },
      handler: async (args: any) => {
        await client.post(`/contacts/${args.contact_id}/taggings`, {
          tag_id: args.tag_id
        });
        return { success: true, message: 'Tag added to contact' };
      }
    },

    // Remove tag from contact
    contacts_remove_tag: {
      description: 'Remove a tag from a contact',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'string',
            description: 'Contact ID',
            required: true
          },
          tag_id: {
            type: 'string',
            description: 'Tag ID to remove',
            required: true
          }
        },
        required: ['contact_id', 'tag_id']
      },
      handler: async (args: any) => {
        await client.delete(`/contacts/${args.contact_id}/taggings/${args.tag_id}`);
        return { success: true, message: 'Tag removed from contact' };
      }
    },

    // Import contacts (initiate)
    contacts_import: {
      description: 'Initiate a contact import from CSV data',
      parameters: {
        type: 'object',
        properties: {
          file_name: {
            type: 'string',
            description: 'Name for the import file',
            required: true
          },
          list_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'List IDs to add imported contacts to',
            required: true
          }
        },
        required: ['file_name', 'list_ids']
      },
      handler: async (args: any) => {
        const importData = {
          file_name: args.file_name,
          list_ids: args.list_ids
        };
        return await client.post('/contacts/imports', importData);
      }
    },

    // Export contacts
    contacts_export: {
      description: 'Export contacts to CSV',
      parameters: {
        type: 'object',
        properties: {
          list_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'List IDs to export contacts from'
          },
          segment_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Segment IDs to export contacts from'
          },
          status: {
            type: 'string',
            enum: ['all', 'active', 'unsubscribed'],
            description: 'Contact status filter'
          }
        }
      },
      handler: async (args: any) => {
        const exportParams: any = {};
        if (args.list_ids) exportParams.list_ids = args.list_ids;
        if (args.segment_ids) exportParams.segment_ids = args.segment_ids;
        if (args.status) exportParams.status = args.status;
        
        return await client.post('/contacts/exports', exportParams);
      }
    },

    // Get contact activity
    contacts_get_activity: {
      description: 'Get tracking activity for a contact',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'string',
            description: 'Contact ID',
            required: true
          },
          tracking_type: {
            type: 'string',
            enum: ['em_sends', 'em_opens', 'em_clicks', 'em_bounces', 'em_optouts', 'em_forwards'],
            description: 'Type of activity to retrieve'
          },
          limit: {
            type: 'number',
            description: 'Max number of activities'
          }
        },
        required: ['contact_id']
      },
      handler: async (args: any) => {
        const params: any = { contact_id: args.contact_id };
        if (args.tracking_type) params.tracking_activities = args.tracking_type;
        if (args.limit) params.limit = args.limit;
        
        return await client.getPaginated<ContactActivity>(
          '/reports/contact_tracking',
          params,
          args.limit
        );
      }
    }
  };
}
