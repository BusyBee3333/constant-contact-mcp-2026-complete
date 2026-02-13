import type { ConstantContactClient } from '../clients/constant-contact.js';
import type { EmailCampaign, CampaignActivity, CampaignStats } from '../types/index.js';

export function registerCampaignsTools(client: ConstantContactClient) {
  return {
    // List campaigns
    campaigns_list: {
      description: 'List all email campaigns',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of campaigns to return'
          },
          status: {
            type: 'string',
            enum: ['ALL', 'DRAFT', 'SCHEDULED', 'SENT', 'SENDING', 'DONE', 'ERROR'],
            description: 'Filter by campaign status'
          }
        }
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.limit) params.limit = args.limit;
        if (args.status) params.status = args.status;
        
        return await client.getPaginated<EmailCampaign>('/emails', params, args.limit);
      }
    },

    // Get campaign by ID
    campaigns_get: {
      description: 'Get a specific campaign by ID',
      parameters: {
        type: 'object',
        properties: {
          campaign_id: {
            type: 'string',
            description: 'Campaign ID',
            required: true
          }
        },
        required: ['campaign_id']
      },
      handler: async (args: any) => {
        return await client.get<EmailCampaign>(`/emails/activities/${args.campaign_id}`);
      }
    },

    // Create campaign
    campaigns_create: {
      description: 'Create a new email campaign',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Campaign name',
            required: true
          },
          subject: {
            type: 'string',
            description: 'Email subject line',
            required: true
          },
          from_name: {
            type: 'string',
            description: 'Sender name',
            required: true
          },
          from_email: {
            type: 'string',
            description: 'Sender email address',
            required: true
          },
          reply_to_email: {
            type: 'string',
            description: 'Reply-to email address',
            required: true
          },
          html_content: {
            type: 'string',
            description: 'HTML email content'
          },
          preheader: {
            type: 'string',
            description: 'Email preheader text'
          }
        },
        required: ['name', 'subject', 'from_name', 'from_email', 'reply_to_email']
      },
      handler: async (args: any) => {
        const campaign = {
          name: args.name,
          email_campaign_activities: [{
            format_type: 5,
            from_name: args.from_name,
            from_email: args.from_email,
            reply_to_email: args.reply_to_email,
            subject: args.subject,
            preheader: args.preheader || '',
            html_content: args.html_content || '<html><body>Email content here</body></html>'
          }]
        };
        
        return await client.post<EmailCampaign>('/emails', campaign);
      }
    },

    // Update campaign
    campaigns_update: {
      description: 'Update an existing campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          },
          subject: { type: 'string', description: 'Email subject' },
          from_name: { type: 'string', description: 'Sender name' },
          from_email: { type: 'string', description: 'Sender email' },
          reply_to_email: { type: 'string', description: 'Reply-to email' },
          html_content: { type: 'string', description: 'HTML content' },
          preheader: { type: 'string', description: 'Preheader text' }
        },
        required: ['campaign_activity_id']
      },
      handler: async (args: any) => {
        const { campaign_activity_id, ...updates } = args;
        return await client.patch<CampaignActivity>(
          `/emails/activities/${campaign_activity_id}`,
          updates
        );
      }
    },

    // Delete campaign
    campaigns_delete: {
      description: 'Delete a campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_id: {
            type: 'string',
            description: 'Campaign ID',
            required: true
          }
        },
        required: ['campaign_id']
      },
      handler: async (args: any) => {
        await client.delete(`/emails/${args.campaign_id}`);
        return { success: true, message: `Campaign ${args.campaign_id} deleted` };
      }
    },

    // Schedule campaign
    campaigns_schedule: {
      description: 'Schedule a campaign to send at a specific time',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          },
          scheduled_date: {
            type: 'string',
            description: 'ISO 8601 date-time string (e.g., "2024-12-25T10:00:00Z")',
            required: true
          },
          contact_list_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'List IDs to send to'
          },
          segment_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Segment IDs to send to'
          }
        },
        required: ['campaign_activity_id', 'scheduled_date']
      },
      handler: async (args: any) => {
        const scheduleData: any = {
          scheduled_date: args.scheduled_date
        };
        
        if (args.contact_list_ids) scheduleData.contact_list_ids = args.contact_list_ids;
        if (args.segment_ids) scheduleData.segment_ids = args.segment_ids;
        
        return await client.post(
          `/emails/activities/${args.campaign_activity_id}/schedules`,
          scheduleData
        );
      }
    },

    // Send campaign immediately
    campaigns_send: {
      description: 'Send a campaign immediately',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          },
          contact_list_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'List IDs to send to',
            required: true
          },
          segment_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Segment IDs to send to'
          }
        },
        required: ['campaign_activity_id', 'contact_list_ids']
      },
      handler: async (args: any) => {
        const sendData: any = {
          contact_list_ids: args.contact_list_ids
        };
        
        if (args.segment_ids) sendData.segment_ids = args.segment_ids;
        
        // Schedule for immediate send (now)
        const now = new Date().toISOString();
        sendData.scheduled_date = now;
        
        return await client.post(
          `/emails/activities/${args.campaign_activity_id}/schedules`,
          sendData
        );
      }
    },

    // Get campaign stats
    campaigns_get_stats: {
      description: 'Get statistics for a campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          }
        },
        required: ['campaign_activity_id']
      },
      handler: async (args: any) => {
        return await client.get<CampaignStats>(
          `/reports/stats/email_campaign_activities/${args.campaign_activity_id}`
        );
      }
    },

    // List campaign activities
    campaigns_list_activities: {
      description: 'List all activities for a campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_id: {
            type: 'string',
            description: 'Campaign ID',
            required: true
          }
        },
        required: ['campaign_id']
      },
      handler: async (args: any) => {
        return await client.get<{ campaign_activities: CampaignActivity[] }>(
          `/emails/${args.campaign_id}`
        );
      }
    },

    // Clone campaign
    campaigns_clone: {
      description: 'Clone an existing campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_id: {
            type: 'string',
            description: 'Campaign ID to clone',
            required: true
          },
          new_name: {
            type: 'string',
            description: 'Name for the cloned campaign',
            required: true
          }
        },
        required: ['campaign_id', 'new_name']
      },
      handler: async (args: any) => {
        // Get original campaign
        const original = await client.get<EmailCampaign>(`/emails/${args.campaign_id}`);
        
        // Create clone with new name
        const clone = {
          name: args.new_name,
          email_campaign_activities: original.campaign_activities
        };
        
        return await client.post<EmailCampaign>('/emails', clone);
      }
    },

    // Test send campaign
    campaigns_test_send: {
      description: 'Send a test version of the campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          },
          email_addresses: {
            type: 'array',
            items: { type: 'string' },
            description: 'Email addresses to send test to',
            required: true
          },
          personal_message: {
            type: 'string',
            description: 'Optional personal message to include in test'
          }
        },
        required: ['campaign_activity_id', 'email_addresses']
      },
      handler: async (args: any) => {
        const testData: any = {
          email_addresses: args.email_addresses
        };
        
        if (args.personal_message) testData.personal_message = args.personal_message;
        
        return await client.post(
          `/emails/activities/${args.campaign_activity_id}/tests`,
          testData
        );
      }
    },

    // Unschedule campaign
    campaigns_unschedule: {
      description: 'Cancel a scheduled campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          }
        },
        required: ['campaign_activity_id']
      },
      handler: async (args: any) => {
        await client.delete(`/emails/activities/${args.campaign_activity_id}/schedules`);
        return { success: true, message: 'Campaign unscheduled' };
      }
    }
  };
}
