#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "constant-contact";
const MCP_VERSION = "1.0.0";
const API_BASE_URL = "https://api.cc.email/v3";

// ============================================
// API CLIENT - Constant Contact uses OAuth2 Bearer token
// ============================================
class ConstantContactClient {
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Constant Contact API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    if (response.status === 204) {
      return { success: true };
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

// ============================================
// TOOL DEFINITIONS
// ============================================
const tools = [
  {
    name: "list_contacts",
    description: "List contacts with filtering and pagination. Returns contact email, name, and list memberships.",
    inputSchema: {
      type: "object" as const,
      properties: {
        status: {
          type: "string",
          enum: ["all", "active", "deleted", "not_set", "pending_confirmation", "temp_hold", "unsubscribed"],
          description: "Filter by contact status (default: all)",
        },
        email: { type: "string", description: "Filter by exact email address" },
        lists: { type: "string", description: "Comma-separated list IDs to filter by" },
        segment_id: { type: "string", description: "Filter by segment ID" },
        limit: { type: "number", description: "Results per page (default 50, max 500)" },
        include: {
          type: "string",
          enum: ["custom_fields", "list_memberships", "phone_numbers", "street_addresses", "notes", "taggings"],
          description: "Include additional data",
        },
        include_count: { type: "boolean", description: "Include total count in response" },
        cursor: { type: "string", description: "Pagination cursor from previous response" },
      },
    },
  },
  {
    name: "add_contact",
    description: "Create or update a contact. If email exists, contact is updated.",
    inputSchema: {
      type: "object" as const,
      properties: {
        email_address: { type: "string", description: "Email address (required)" },
        first_name: { type: "string", description: "First name" },
        last_name: { type: "string", description: "Last name" },
        job_title: { type: "string", description: "Job title" },
        company_name: { type: "string", description: "Company name" },
        phone_numbers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              phone_number: { type: "string" },
              kind: { type: "string", enum: ["home", "work", "mobile", "other"] },
            },
          },
          description: "Phone numbers",
        },
        street_addresses: {
          type: "array",
          items: {
            type: "object",
            properties: {
              street: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              postal_code: { type: "string" },
              country: { type: "string" },
              kind: { type: "string", enum: ["home", "work", "other"] },
            },
          },
          description: "Street addresses",
        },
        list_memberships: {
          type: "array",
          items: { type: "string" },
          description: "Array of list IDs to add contact to",
        },
        custom_fields: {
          type: "array",
          items: {
            type: "object",
            properties: {
              custom_field_id: { type: "string" },
              value: { type: "string" },
            },
          },
          description: "Custom field values",
        },
        birthday_month: { type: "number", description: "Birthday month (1-12)" },
        birthday_day: { type: "number", description: "Birthday day (1-31)" },
        anniversary: { type: "string", description: "Anniversary date (YYYY-MM-DD)" },
        create_source: { type: "string", enum: ["Contact", "Account"], description: "Source of contact creation" },
      },
      required: ["email_address"],
    },
  },
  {
    name: "list_campaigns",
    description: "List email campaigns (email activities)",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Results per page (default 50, max 500)" },
        before_date: { type: "string", description: "Filter campaigns before this date (ISO 8601)" },
        after_date: { type: "string", description: "Filter campaigns after this date (ISO 8601)" },
        cursor: { type: "string", description: "Pagination cursor" },
      },
    },
  },
  {
    name: "create_campaign",
    description: "Create a new email campaign",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Campaign name (required)" },
        subject: { type: "string", description: "Email subject line (required)" },
        from_name: { type: "string", description: "From name displayed to recipients (required)" },
        from_email: { type: "string", description: "From email address (required, must be verified)" },
        reply_to_email: { type: "string", description: "Reply-to email address" },
        html_content: { type: "string", description: "HTML content of the email" },
        text_content: { type: "string", description: "Plain text content of the email" },
        format_type: {
          type: "number",
          enum: [1, 2, 3, 4, 5],
          description: "Format: 1=HTML, 2=TEXT, 3=HTML+TEXT, 4=TEMPLATE, 5=AMP+HTML+TEXT",
        },
        physical_address_in_footer: {
          type: "object",
          properties: {
            address_line1: { type: "string" },
            address_line2: { type: "string" },
            address_line3: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            postal_code: { type: "string" },
            country: { type: "string" },
            organization_name: { type: "string" },
          },
          description: "Physical address for CAN-SPAM compliance",
        },
      },
      required: ["name", "subject", "from_name", "from_email"],
    },
  },
  {
    name: "list_lists",
    description: "List all contact lists",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Results per page (default 50, max 1000)" },
        include_count: { type: "boolean", description: "Include contact count per list" },
        include_membership_count: { type: "string", enum: ["all", "active", "unsubscribed"], description: "Which membership counts to include" },
        cursor: { type: "string", description: "Pagination cursor" },
      },
    },
  },
  {
    name: "add_to_list",
    description: "Add one or more contacts to a list",
    inputSchema: {
      type: "object" as const,
      properties: {
        list_id: { type: "string", description: "List ID to add contacts to (required)" },
        contact_ids: {
          type: "array",
          items: { type: "string" },
          description: "Array of contact IDs to add (required)",
        },
      },
      required: ["list_id", "contact_ids"],
    },
  },
  {
    name: "get_campaign_stats",
    description: "Get tracking statistics for a campaign (sends, opens, clicks, bounces, etc.)",
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_activity_id: { type: "string", description: "Campaign activity ID (required)" },
      },
      required: ["campaign_activity_id"],
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: ConstantContactClient, name: string, args: any) {
  switch (name) {
    case "list_contacts": {
      const params = new URLSearchParams();
      if (args.status) params.append("status", args.status);
      if (args.email) params.append("email", args.email);
      if (args.lists) params.append("lists", args.lists);
      if (args.segment_id) params.append("segment_id", args.segment_id);
      if (args.limit) params.append("limit", args.limit.toString());
      if (args.include) params.append("include", args.include);
      if (args.include_count) params.append("include_count", "true");
      if (args.cursor) params.append("cursor", args.cursor);
      const query = params.toString();
      return await client.get(`/contacts${query ? `?${query}` : ""}`);
    }

    case "add_contact": {
      const payload: any = {
        email_address: {
          address: args.email_address,
          permission_to_send: "implicit",
        },
      };
      if (args.first_name) payload.first_name = args.first_name;
      if (args.last_name) payload.last_name = args.last_name;
      if (args.job_title) payload.job_title = args.job_title;
      if (args.company_name) payload.company_name = args.company_name;
      if (args.phone_numbers) payload.phone_numbers = args.phone_numbers;
      if (args.street_addresses) payload.street_addresses = args.street_addresses;
      if (args.list_memberships) payload.list_memberships = args.list_memberships;
      if (args.custom_fields) payload.custom_fields = args.custom_fields;
      if (args.birthday_month) payload.birthday_month = args.birthday_month;
      if (args.birthday_day) payload.birthday_day = args.birthday_day;
      if (args.anniversary) payload.anniversary = args.anniversary;
      if (args.create_source) payload.create_source = args.create_source;
      return await client.post("/contacts/sign_up_form", payload);
    }

    case "list_campaigns": {
      const params = new URLSearchParams();
      if (args.limit) params.append("limit", args.limit.toString());
      if (args.before_date) params.append("before_date", args.before_date);
      if (args.after_date) params.append("after_date", args.after_date);
      if (args.cursor) params.append("cursor", args.cursor);
      const query = params.toString();
      return await client.get(`/emails${query ? `?${query}` : ""}`);
    }

    case "create_campaign": {
      // First create the campaign
      const campaignPayload: any = {
        name: args.name,
        email_campaign_activities: [
          {
            format_type: args.format_type || 5,
            from_name: args.from_name,
            from_email: args.from_email,
            reply_to_email: args.reply_to_email || args.from_email,
            subject: args.subject,
            html_content: args.html_content || "",
            text_content: args.text_content || "",
          },
        ],
      };

      if (args.physical_address_in_footer) {
        campaignPayload.email_campaign_activities[0].physical_address_in_footer = args.physical_address_in_footer;
      }

      return await client.post("/emails", campaignPayload);
    }

    case "list_lists": {
      const params = new URLSearchParams();
      if (args.limit) params.append("limit", args.limit.toString());
      if (args.include_count) params.append("include_count", "true");
      if (args.include_membership_count) params.append("include_membership_count", args.include_membership_count);
      if (args.cursor) params.append("cursor", args.cursor);
      const query = params.toString();
      return await client.get(`/contact_lists${query ? `?${query}` : ""}`);
    }

    case "add_to_list": {
      const { list_id, contact_ids } = args;
      // Constant Contact uses a specific endpoint for bulk adding to lists
      const payload = {
        source: {
          contact_ids: contact_ids,
        },
        list_ids: [list_id],
      };
      return await client.post("/activities/add_list_memberships", payload);
    }

    case "get_campaign_stats": {
      const { campaign_activity_id } = args;
      return await client.get(`/reports/email_reports/${campaign_activity_id}/tracking/sends`);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const accessToken = process.env.CONSTANT_CONTACT_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error("Error: CONSTANT_CONTACT_ACCESS_TOKEN environment variable required");
    console.error("Get your access token from the Constant Contact V3 API after OAuth2 authorization");
    process.exit(1);
  }

  const client = new ConstantContactClient(accessToken);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
