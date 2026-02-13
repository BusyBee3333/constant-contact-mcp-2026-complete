import type { ConstantContactClient } from '../clients/constant-contact.js';
import type { SocialPost } from '../types/index.js';

export function registerSocialTools(client: ConstantContactClient) {
  return {
    // List social posts
    social_list_posts: {
      description: 'List all social media posts',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of posts to return'
          },
          status: {
            type: 'string',
            enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED'],
            description: 'Filter by post status'
          }
        }
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.limit) params.limit = args.limit;
        if (args.status) params.status = args.status;
        
        return await client.getPaginated<SocialPost>('/social/posts', params, args.limit);
      }
    },

    // Get social post by ID
    social_get_post: {
      description: 'Get a specific social media post by ID',
      parameters: {
        type: 'object',
        properties: {
          post_id: {
            type: 'string',
            description: 'Social post ID',
            required: true
          }
        },
        required: ['post_id']
      },
      handler: async (args: any) => {
        return await client.get<SocialPost>(`/social/posts/${args.post_id}`);
      }
    },

    // Create social post
    social_create_post: {
      description: 'Create a new social media post',
      parameters: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            description: 'Post content/text',
            required: true
          },
          platforms: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['facebook', 'twitter', 'linkedin', 'instagram']
            },
            description: 'Social platforms to post to',
            required: true
          },
          scheduled_time: {
            type: 'string',
            description: 'ISO 8601 date-time for scheduled posting (leave empty for draft)'
          },
          image_url: {
            type: 'string',
            description: 'URL of image to attach'
          },
          link_url: {
            type: 'string',
            description: 'URL to include in post'
          }
        },
        required: ['content', 'platforms']
      },
      handler: async (args: any) => {
        const postData: Partial<SocialPost> = {
          content: args.content,
          platforms: args.platforms,
          status: args.scheduled_time ? 'SCHEDULED' : 'DRAFT'
        };
        
        if (args.scheduled_time) postData.scheduled_time = args.scheduled_time;
        if (args.image_url) postData.image_url = args.image_url;
        if (args.link_url) postData.link_url = args.link_url;
        
        return await client.post<SocialPost>('/social/posts', postData);
      }
    },

    // Update social post
    social_update_post: {
      description: 'Update an existing social media post',
      parameters: {
        type: 'object',
        properties: {
          post_id: {
            type: 'string',
            description: 'Social post ID',
            required: true
          },
          content: {
            type: 'string',
            description: 'Updated post content'
          },
          scheduled_time: {
            type: 'string',
            description: 'Updated scheduled time'
          },
          image_url: {
            type: 'string',
            description: 'Updated image URL'
          },
          link_url: {
            type: 'string',
            description: 'Updated link URL'
          }
        },
        required: ['post_id']
      },
      handler: async (args: any) => {
        const { post_id, ...updates } = args;
        return await client.put<SocialPost>(`/social/posts/${post_id}`, updates);
      }
    },

    // Delete social post
    social_delete_post: {
      description: 'Delete a social media post',
      parameters: {
        type: 'object',
        properties: {
          post_id: {
            type: 'string',
            description: 'Social post ID to delete',
            required: true
          }
        },
        required: ['post_id']
      },
      handler: async (args: any) => {
        await client.delete(`/social/posts/${args.post_id}`);
        return { success: true, message: `Social post ${args.post_id} deleted` };
      }
    },

    // Publish social post immediately
    social_publish_now: {
      description: 'Publish a social post immediately',
      parameters: {
        type: 'object',
        properties: {
          post_id: {
            type: 'string',
            description: 'Social post ID',
            required: true
          }
        },
        required: ['post_id']
      },
      handler: async (args: any) => {
        return await client.post(`/social/posts/${args.post_id}/publish`, {});
      }
    }
  };
}
