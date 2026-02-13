import type { ConstantContactClient } from '../clients/constant-contact.js';
import type { CampaignStats, ContactStats, BounceReport, ClickReport, OpenReport } from '../types/index.js';

export function registerReportingTools(client: ConstantContactClient) {
  return {
    // Get campaign statistics
    reporting_campaign_stats: {
      description: 'Get detailed statistics for a campaign',
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

    // Get contact statistics
    reporting_contact_stats: {
      description: 'Get email activity statistics for a specific contact',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'string',
            description: 'Contact ID',
            required: true
          },
          start_date: {
            type: 'string',
            description: 'Start date in ISO format (YYYY-MM-DD)'
          },
          end_date: {
            type: 'string',
            description: 'End date in ISO format (YYYY-MM-DD)'
          }
        },
        required: ['contact_id']
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.start_date) params.start_date = args.start_date;
        if (args.end_date) params.end_date = args.end_date;
        
        return await client.get<ContactStats>(
          `/reports/contact_reports/${args.contact_id}/activity_summary`,
          params
        );
      }
    },

    // Get bounce summary
    reporting_bounce_summary: {
      description: 'Get bounce report for a campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          },
          bounce_code: {
            type: 'string',
            description: 'Filter by specific bounce code (e.g., "B", "Z", "D")'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of bounce records'
          }
        },
        required: ['campaign_activity_id']
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.bounce_code) params.bounce_code = args.bounce_code;
        if (args.limit) params.limit = args.limit;
        
        return await client.getPaginated<BounceReport>(
          `/reports/email_reports/${args.campaign_activity_id}/tracking/bounces`,
          params,
          args.limit
        );
      }
    },

    // Get click summary
    reporting_click_summary: {
      description: 'Get click tracking data for a campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          },
          url_id: {
            type: 'string',
            description: 'Filter by specific URL ID'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of click records'
          }
        },
        required: ['campaign_activity_id']
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.url_id) params.url_id = args.url_id;
        if (args.limit) params.limit = args.limit;
        
        return await client.getPaginated<ClickReport>(
          `/reports/email_reports/${args.campaign_activity_id}/tracking/clicks`,
          params,
          args.limit
        );
      }
    },

    // Get open summary
    reporting_open_summary: {
      description: 'Get open tracking data for a campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          },
          limit: {
            type: 'number',
            description: 'Maximum number of open records'
          }
        },
        required: ['campaign_activity_id']
      },
      handler: async (args: any) => {
        const params = args.limit ? { limit: args.limit } : undefined;
        
        return await client.getPaginated<OpenReport>(
          `/reports/email_reports/${args.campaign_activity_id}/tracking/opens`,
          params,
          args.limit
        );
      }
    },

    // Get unique opens
    reporting_unique_opens: {
      description: 'Get unique opens count and data for a campaign',
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
        const stats = await client.get<CampaignStats>(
          `/reports/stats/email_campaign_activities/${args.campaign_activity_id}`
        );
        
        return {
          campaign_activity_id: args.campaign_activity_id,
          unique_opens: stats.stats?.unique_opens || 0,
          open_rate: stats.stats?.open_rate || 0
        };
      }
    },

    // Get unique clicks
    reporting_unique_clicks: {
      description: 'Get unique clicks count and data for a campaign',
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
        const stats = await client.get<CampaignStats>(
          `/reports/stats/email_campaign_activities/${args.campaign_activity_id}`
        );
        
        return {
          campaign_activity_id: args.campaign_activity_id,
          unique_clicks: stats.stats?.unique_clicks || 0,
          click_rate: stats.stats?.click_rate || 0
        };
      }
    },

    // Get forwards report
    reporting_forwards: {
      description: 'Get email forward tracking for a campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          },
          limit: {
            type: 'number',
            description: 'Maximum number of forward records'
          }
        },
        required: ['campaign_activity_id']
      },
      handler: async (args: any) => {
        const params = args.limit ? { limit: args.limit } : undefined;
        
        return await client.getPaginated(
          `/reports/email_reports/${args.campaign_activity_id}/tracking/forwards`,
          params,
          args.limit
        );
      }
    },

    // Get optouts/unsubscribes
    reporting_optouts: {
      description: 'Get unsubscribe data for a campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          },
          limit: {
            type: 'number',
            description: 'Maximum number of optout records'
          }
        },
        required: ['campaign_activity_id']
      },
      handler: async (args: any) => {
        const params = args.limit ? { limit: args.limit } : undefined;
        
        return await client.getPaginated(
          `/reports/email_reports/${args.campaign_activity_id}/tracking/optouts`,
          params,
          args.limit
        );
      }
    },

    // Get sends report
    reporting_sends: {
      description: 'Get send data for a campaign',
      parameters: {
        type: 'object',
        properties: {
          campaign_activity_id: {
            type: 'string',
            description: 'Campaign activity ID',
            required: true
          },
          limit: {
            type: 'number',
            description: 'Maximum number of send records'
          }
        },
        required: ['campaign_activity_id']
      },
      handler: async (args: any) => {
        const params = args.limit ? { limit: args.limit } : undefined;
        
        return await client.getPaginated(
          `/reports/email_reports/${args.campaign_activity_id}/tracking/sends`,
          params,
          args.limit
        );
      }
    },

    // Get campaign links
    reporting_campaign_links: {
      description: 'Get all links tracked in a campaign',
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
        return await client.get(
          `/reports/email_reports/${args.campaign_activity_id}/links`
        );
      }
    }
  };
}
