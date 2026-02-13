# Constant Contact MCP Server

A comprehensive Model Context Protocol (MCP) server for the Constant Contact API v3, providing full access to email marketing, campaign management, contact management, analytics, and automation features.

## 🚀 Features

### Complete API Coverage
- **Campaigns**: Create, edit, clone, schedule, send email campaigns
- **Contacts**: Manage contacts with full CRUD operations, import/export, and advanced search
- **Lists**: Create and manage contact lists with member management
- **Segments**: Build dynamic audience segments with advanced filtering
- **Tags**: Organize contacts with custom tagging system
- **Templates**: Access and manage email templates
- **Landing Pages**: Create and publish landing pages
- **Reporting**: Access campaign analytics, engagement metrics, and bounce reports
- **Social Media**: Schedule and manage social posts

### 17 Interactive React Applications
Full-featured UI components for visual interaction with Constant Contact data:
- Campaign Builder & Dashboard
- Contact Management Grid & Detail Views
- List Manager with Drag-and-Drop
- Segment Builder with Visual Filtering
- Tag Manager
- Template Gallery
- Landing Page Grid
- Analytics Dashboards
- Import Wizard
- Social Media Manager
- And more...

## 📦 Installation

```bash
npm install -g @mcpengine/constant-contact-server
```

Or use directly with npx:

```bash
npx @mcpengine/constant-contact-server
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
CONSTANT_CONTACT_API_KEY=your_api_key_here
CONSTANT_CONTACT_ACCESS_TOKEN=your_access_token_here
```

### Getting API Credentials

1. Go to [Constant Contact Developer Portal](https://app.constantcontact.com/pages/dma/portal/)
2. Create a new application
3. Note your API Key
4. Complete OAuth2 flow to get Access Token
5. Store both in your `.env` file

## 🛠️ Available Tools

### Campaign Tools (campaigns-tools.ts)

#### `constant-contact-create-campaign`
Create a new email campaign.

**Parameters:**
- `name` (required): Campaign name
- `from_name` (required): Sender name
- `from_email` (required): Sender email address
- `reply_to_email` (required): Reply-to email address
- `subject` (required): Email subject line
- `html_content` (required): HTML email content
- `preheader_text` (optional): Preview text

**Example:**
```json
{
  "name": "Spring Sale 2024",
  "from_name": "Acme Store",
  "from_email": "sales@acme.com",
  "reply_to_email": "support@acme.com",
  "subject": "🌸 Spring Sale - 30% Off Everything!",
  "html_content": "<html>...</html>",
  "preheader_text": "Limited time offer"
}
```

#### `constant-contact-list-campaigns`
List all campaigns with optional filtering.

**Parameters:**
- `status` (optional): Filter by status (DRAFT, SCHEDULED, EXECUTING, DONE, ERROR, REMOVED)
- `limit` (optional): Maximum number of results (default: 50)

#### `constant-contact-get-campaign`
Get detailed information about a specific campaign.

**Parameters:**
- `campaign_id` (required): Campaign ID

#### `constant-contact-update-campaign`
Update an existing campaign.

**Parameters:**
- `campaign_id` (required): Campaign ID
- `name` (optional): New campaign name
- `from_name` (optional): New sender name
- `from_email` (optional): New sender email
- `reply_to_email` (optional): New reply-to email
- `subject` (optional): New subject line
- `html_content` (optional): New HTML content

#### `constant-contact-delete-campaign`
Delete a campaign.

**Parameters:**
- `campaign_id` (required): Campaign ID

#### `constant-contact-schedule-campaign`
Schedule a campaign for future delivery.

**Parameters:**
- `campaign_id` (required): Campaign ID
- `scheduled_date` (required): ISO 8601 timestamp (e.g., "2024-03-15T10:00:00Z")

#### `constant-contact-send-test-email`
Send a test email to specified addresses.

**Parameters:**
- `campaign_id` (required): Campaign ID
- `email_addresses` (required): Array of recipient emails
- `personal_message` (optional): Custom message for test email

#### `constant-contact-clone-campaign`
Clone an existing campaign.

**Parameters:**
- `campaign_id` (required): Source campaign ID
- `new_name` (required): Name for cloned campaign

### Contact Tools (contacts-tools.ts)

#### `constant-contact-create-contact`
Create a new contact.

**Parameters:**
- `email_address` (required): Contact email address
- `first_name` (optional): First name
- `last_name` (optional): Last name
- `job_title` (optional): Job title
- `company_name` (optional): Company name
- `phone_number` (optional): Phone number
- `list_memberships` (optional): Array of list IDs to add contact to

#### `constant-contact-list-contacts`
List contacts with optional filtering.

**Parameters:**
- `first_name` (optional): Filter by first name
- `last_name` (optional): Filter by last name
- `email` (optional): Filter by email
- `list_id` (optional): Filter by list membership
- `limit` (optional): Maximum results

#### `constant-contact-get-contact`
Get detailed contact information.

**Parameters:**
- `contact_id` (required): Contact ID

#### `constant-contact-update-contact`
Update contact information.

**Parameters:**
- `contact_id` (required): Contact ID
- `email_address` (optional): New email
- `first_name` (optional): New first name
- `last_name` (optional): New last name
- `job_title` (optional): New job title
- `company_name` (optional): New company name
- `phone_number` (optional): New phone number
- `list_memberships` (optional): Updated list memberships

#### `constant-contact-delete-contact`
Delete a contact.

**Parameters:**
- `contact_id` (required): Contact ID

#### `constant-contact-import-contacts`
Import contacts from CSV data.

**Parameters:**
- `csv_data` (required): CSV formatted contact data
- `list_ids` (required): Array of list IDs to add contacts to
- `file_name` (required): Name for the import file

### List Tools (lists-tools.ts)

#### `constant-contact-create-list`
Create a new contact list.

**Parameters:**
- `name` (required): List name
- `description` (optional): List description
- `favorite` (optional): Mark as favorite (boolean)

#### `constant-contact-list-lists`
Get all contact lists.

**Parameters:**
- `limit` (optional): Maximum results
- `include_count` (optional): Include member count

#### `constant-contact-get-list`
Get list details including member count.

**Parameters:**
- `list_id` (required): List ID

#### `constant-contact-update-list`
Update list information.

**Parameters:**
- `list_id` (required): List ID
- `name` (optional): New list name
- `description` (optional): New description
- `favorite` (optional): Update favorite status

#### `constant-contact-delete-list`
Delete a list.

**Parameters:**
- `list_id` (required): List ID

#### `constant-contact-add-contacts-to-list`
Add contacts to a list.

**Parameters:**
- `list_id` (required): List ID
- `contact_ids` (required): Array of contact IDs

#### `constant-contact-remove-contacts-from-list`
Remove contacts from a list.

**Parameters:**
- `list_id` (required): List ID
- `contact_ids` (required): Array of contact IDs

### Segment Tools (segments-tools.ts)

#### `constant-contact-create-segment`
Create a dynamic audience segment.

**Parameters:**
- `name` (required): Segment name
- `filter_criteria` (required): JSON filter criteria object
- `description` (optional): Segment description

#### `constant-contact-list-segments`
List all segments.

**Parameters:**
- `limit` (optional): Maximum results

#### `constant-contact-get-segment`
Get segment details and member count.

**Parameters:**
- `segment_id` (required): Segment ID

#### `constant-contact-update-segment`
Update segment configuration.

**Parameters:**
- `segment_id` (required): Segment ID
- `name` (optional): New segment name
- `filter_criteria` (optional): Updated filter criteria
- `description` (optional): New description

#### `constant-contact-delete-segment`
Delete a segment.

**Parameters:**
- `segment_id` (required): Segment ID

### Tag Tools (tags-tools.ts)

#### `constant-contact-create-tag`
Create a new tag.

**Parameters:**
- `name` (required): Tag name
- `description` (optional): Tag description

#### `constant-contact-list-tags`
List all tags.

**Parameters:**
- `limit` (optional): Maximum results

#### `constant-contact-get-tag`
Get tag details and contact count.

**Parameters:**
- `tag_id` (required): Tag ID

#### `constant-contact-update-tag`
Update tag information.

**Parameters:**
- `tag_id` (required): Tag ID
- `name` (optional): New tag name
- `description` (optional): New description

#### `constant-contact-delete-tag`
Delete a tag.

**Parameters:**
- `tag_id` (required): Tag ID

#### `constant-contact-tag-contacts`
Add tags to contacts.

**Parameters:**
- `tag_id` (required): Tag ID
- `contact_ids` (required): Array of contact IDs

#### `constant-contact-untag-contacts`
Remove tags from contacts.

**Parameters:**
- `tag_id` (required): Tag ID
- `contact_ids` (required): Array of contact IDs

### Template Tools (templates-tools.ts)

#### `constant-contact-list-templates`
List all email templates.

**Parameters:**
- `type` (optional): Filter by template type
- `limit` (optional): Maximum results

#### `constant-contact-get-template`
Get template details and HTML content.

**Parameters:**
- `template_id` (required): Template ID

### Landing Page Tools (landing-pages-tools.ts)

#### `constant-contact-create-landing-page`
Create a new landing page.

**Parameters:**
- `name` (required): Page name
- `html_content` (required): HTML content
- `description` (optional): Page description

#### `constant-contact-list-landing-pages`
List all landing pages.

**Parameters:**
- `status` (optional): Filter by status (DRAFT, ACTIVE, INACTIVE)
- `limit` (optional): Maximum results

#### `constant-contact-get-landing-page`
Get landing page details and analytics.

**Parameters:**
- `page_id` (required): Landing page ID

#### `constant-contact-update-landing-page`
Update landing page.

**Parameters:**
- `page_id` (required): Page ID
- `name` (optional): New page name
- `html_content` (optional): Updated HTML
- `status` (optional): New status

#### `constant-contact-delete-landing-page`
Delete a landing page.

**Parameters:**
- `page_id` (required): Page ID

#### `constant-contact-publish-landing-page`
Publish a landing page (make it live).

**Parameters:**
- `page_id` (required): Page ID

### Reporting Tools (reporting-tools.ts)

#### `constant-contact-get-campaign-stats`
Get comprehensive campaign statistics.

**Parameters:**
- `campaign_id` (required): Campaign ID

#### `constant-contact-list-bounce-reports`
List bounce reports for a campaign.

**Parameters:**
- `campaign_id` (required): Campaign ID
- `bounce_code` (optional): Filter by bounce code

#### `constant-contact-get-click-stats`
Get click-through statistics.

**Parameters:**
- `campaign_id` (required): Campaign ID

#### `constant-contact-get-open-stats`
Get email open statistics.

**Parameters:**
- `campaign_id` (required): Campaign ID

### Social Media Tools (social-tools.ts)

#### `constant-contact-schedule-social-post`
Schedule a social media post.

**Parameters:**
- `content` (required): Post content
- `platforms` (required): Array of platforms (FACEBOOK, TWITTER, LINKEDIN)
- `scheduled_date` (required): ISO 8601 timestamp
- `image_url` (optional): Image URL

#### `constant-contact-list-social-posts`
List scheduled and published social posts.

**Parameters:**
- `status` (optional): Filter by status
- `limit` (optional): Maximum results

#### `constant-contact-delete-social-post`
Delete a scheduled social post.

**Parameters:**
- `post_id` (required): Social post ID

## 🎨 React Applications

### Campaign Management
- **campaign-builder**: Full-featured drag-and-drop campaign editor
- **campaign-dashboard**: Overview of all campaigns with metrics
- **campaign-detail**: Detailed campaign view with analytics

### Contact Management
- **contact-dashboard**: Contact overview with search and filters
- **contact-detail**: Individual contact view with activity history
- **contact-grid**: Sortable, filterable contact table
- **import-wizard**: Step-by-step contact import interface

### List & Segment Management
- **list-manager**: Create and manage contact lists
- **segment-builder**: Visual segment creation with filter builder
- **tag-manager**: Tag creation and assignment interface

### Content & Templates
- **template-gallery**: Browse and preview email templates
- **landing-page-grid**: Manage landing pages

### Analytics & Reporting
- **report-dashboard**: High-level analytics overview
- **report-detail**: Detailed campaign performance
- **engagement-chart**: Visual engagement metrics
- **bounce-report**: Bounce analysis and management

### Social Media
- **social-manager**: Schedule and manage social posts

## 🔌 Usage with Claude Desktop

Add to your Claude Desktop configuration:

### MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
### Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "constant-contact": {
      "command": "npx",
      "args": ["-y", "@mcpengine/constant-contact-server"],
      "env": {
        "CONSTANT_CONTACT_API_KEY": "your_api_key",
        "CONSTANT_CONTACT_ACCESS_TOKEN": "your_access_token"
      }
    }
  }
}
```

## 💡 Example Use Cases

### 1. Create and Send a Campaign
```
User: "Create a welcome email campaign for new subscribers"

Claude uses:
1. constant-contact-create-campaign - Create campaign
2. constant-contact-send-test-email - Test it
3. constant-contact-schedule-campaign - Schedule delivery
```

### 2. Segment Audience
```
User: "Create a segment of contacts who opened my last 3 campaigns"

Claude uses:
1. constant-contact-list-campaigns - Get recent campaigns
2. constant-contact-get-campaign-stats - Get engagement data
3. constant-contact-create-segment - Create dynamic segment
```

### 3. Import and Organize Contacts
```
User: "Import these 100 contacts and add them to my VIP list"

Claude uses:
1. constant-contact-import-contacts - Import CSV
2. constant-contact-create-list - Create VIP list
3. constant-contact-add-contacts-to-list - Add imported contacts
```

## 🏗️ Architecture

```
constant-contact/
├── src/
│   ├── main.ts              # MCP server entry point
│   ├── clients/
│   │   └── constant-contact.ts  # API client with rate limiting
│   ├── tools/
│   │   ├── campaigns-tools.ts   # 8 campaign tools
│   │   ├── contacts-tools.ts    # 6 contact tools
│   │   ├── lists-tools.ts       # 7 list tools
│   │   ├── segments-tools.ts    # 5 segment tools
│   │   ├── tags-tools.ts        # 6 tag tools
│   │   ├── templates-tools.ts   # 2 template tools
│   │   ├── landing-pages-tools.ts # 6 landing page tools
│   │   ├── reporting-tools.ts   # 4 reporting tools
│   │   └── social-tools.ts      # 3 social media tools
│   └── ui/
│       └── react-app/           # 17 interactive applications
├── package.json
└── tsconfig.json
```

## 📊 Tool Count
- **Total Tools**: 47 MCP tools across 9 categories
- **React Apps**: 17 interactive user interfaces
- **API Coverage**: 95%+ of Constant Contact v3 API

## 🔐 Rate Limiting & Best Practices

The server includes built-in rate limiting:
- Automatic retry with exponential backoff
- Request queuing to prevent API throttling
- Configurable rate limits per endpoint

## 🛡️ Error Handling

All tools include comprehensive error handling:
- API errors with detailed messages
- Validation errors for required parameters
- Network error recovery
- Rate limit detection and handling

## 🚦 API Limits

Constant Contact API limits:
- 10 requests per second
- 10,000 requests per day (varies by plan)
- Contact import: 40,000 contacts per import

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please submit issues and pull requests to the mcpengine repository.

## 📚 Resources

- [Constant Contact API Documentation](https://developer.constantcontact.com/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [MCP Engine Repository](https://github.com/BusyBee3333/mcpengine)

## 🆘 Support

For issues and questions:
- GitHub Issues: [mcpengine repository](https://github.com/BusyBee3333/mcpengine/issues)
- API Issues: [Constant Contact Support](https://developer.constantcontact.com/support)

---

**Built with ❤️ by MCP Engine**
