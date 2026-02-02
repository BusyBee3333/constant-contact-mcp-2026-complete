> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/constantcontact)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 🚀 Constant Contact MCP Server — 2026 Complete Version

## 💡 What This Unlocks

**This MCP server gives AI direct access to your entire Constant Contact email marketing workspace.** Instead of clicking through interfaces, you just *tell* it what you need.

Constant Contact is the trusted email marketing platform for 600,000+ small businesses, non-profits, and creators. This MCP server brings its contact management and campaign tools into your AI workflow.

### 🎯 Email Marketing Power Moves

Stop context-switching between Claude and Constant Contact. The AI can directly control your campaigns:

1. **Event-driven campaigns** — "Create a 'Last Chance Webinar' campaign for list #15, send tomorrow at 10am, use our standard footer address"
2. **List intelligence** — "Show me all lists with more than 500 members, compare their active vs unsubscribed ratios, recommend which to target next"
3. **Campaign performance analysis** — "Pull stats for campaigns sent in Q1, identify the top 3 by click rate, what subject lines did they use?"
4. **Contact migration** — "Export all contacts from list 'Old Newsletter' and add them to list 'New Weekly Digest', preserve their custom fields"
5. **Compliance-ready additions** — "Add these 20 trade show contacts to list #8, mark source as 'Conference 2026', ensure they get the double opt-in email"

### 🔗 The Real Power: Combining Tools

AI can chain multiple Constant Contact operations together:

- Query lists → Filter by engagement → Create targeted campaign → Track opens and clicks
- Import contacts → Validate data → Auto-sort into segments → Trigger welcome campaign
- Analyze campaign stats → Identify best performers → Clone winning templates → Schedule A/B tests

## 📦 What's Inside

**7 powerful API tools** covering Constant Contact's email marketing platform:

1. **list_contacts** — Query contacts with filters, segmentation, and pagination
2. **add_contact** — Create contacts with custom fields, phone numbers, and list memberships
3. **list_campaigns** — Browse email campaigns (activities) by date range
4. **create_campaign** — Build email campaigns with HTML, text, and required CAN-SPAM footer
5. **list_lists** — Get all contact lists with membership counts
6. **add_to_list** — Bulk-add contacts to lists via activity API
7. **get_campaign_stats** — Fetch tracking stats (sends, opens, clicks, bounces, unsubscribes)

All with proper error handling, OAuth2 authentication, and TypeScript types.

**API Foundation:** [Constant Contact API v3](https://developer.constantcontact.com/api_guide/index.html) (REST)

## 🚀 Quick Start

### Option 1: Claude Desktop (Local)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/Constant-Contact-MCP-2026-Complete.git
   cd constant-contact-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your Constant Contact OAuth2 access token:**
   - Go to [Constant Contact Developer Portal](https://v3.developer.constantcontact.com/)
   - Create an application or use an existing one
   - Complete the OAuth2 authorization flow to get an access token
   - You'll need: API Key, App Secret, and Access Token (with `contact_data` and `campaign_data` scopes)
   - **Note:** Constant Contact requires OAuth2—you can't use a simple API key

3. **Configure Claude Desktop:**
   
   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "constantcontact": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/constant-contact-mcp-2026-complete/dist/index.js"],
         "env": {
           "CONSTANT_CONTACT_ACCESS_TOKEN": "your-oauth2-access-token"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**

### Option 2: Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/constantcontact-mcp)

1. Click the button above
2. Set `CONSTANT_CONTACT_ACCESS_TOKEN` in Railway dashboard
3. Use the Railway URL as your MCP server endpoint

### Option 3: Docker

```bash
docker build -t constantcontact-mcp .
docker run -p 3000:3000 \
  -e CONSTANT_CONTACT_ACCESS_TOKEN=your-token \
  constantcontact-mcp
```

## 🔐 Authentication

**Constant Contact uses OAuth 2.0 Bearer token authentication** (API v3):

- **Header:** `Authorization: Bearer YOUR_ACCESS_TOKEN`
- **Grant types:** Authorization Code (for user accounts), Implicit (for quick testing)
- **Scopes required:** `contact_data`, `campaign_data`
- **Token lifespan:** Access tokens expire after 24 hours; use refresh tokens for long-term access
- **Rate limits:** 10,000 calls/day on free trials, higher on paid plans

**OAuth2 Setup Guide:**
1. Register your app at: https://v3.developer.constantcontact.com/
2. Use the OAuth2 Playground or your own redirect URL
3. Store the access token securely
4. Implement refresh token logic for production use

The MCP server handles authentication automatically—just set `CONSTANT_CONTACT_ACCESS_TOKEN`.

## 🎯 Example Prompts for Email Marketers

Once connected to Claude, use natural language. Here are real email marketing workflows:

### Campaign Management
- *"List all campaigns sent in the last 14 days"*
- *"Create a campaign called 'Newsletter March 2026', subject 'Spring Updates', from marketing@mycompany.com"*
- *"Show me campaigns with 'sale' in the name, what were their open rates?"*

### Contact Operations
- *"Find all contacts with email addresses from @gmail.com added this month"*
- *"Add contact john@example.com to list #42, include first name 'John' and company 'Acme Corp'"*
- *"List all contacts in the 'VIP Customers' list who haven't unsubscribed"*

### List Management
- *"Show me all my contact lists sorted by size, which has the most active members?"*
- *"Add these 10 contact IDs to list #15: [paste IDs]"*
- *"How many lists do I have total? Which ones were created this year?"*

### Performance Analysis
- *"Get stats for campaign activity #abc123xyz, what was the click-through rate?"*
- *"Compare open rates for my last 5 campaigns, which performed best?"*
- *"Show me bounce stats for campaign #789, were they hard or soft bounces?"*

### Bulk Operations
- *"Export all contacts from lists #10, #12, and #15 as JSON"*
- *"Create 3 new campaigns from template, one for each product launch, schedule them for next week"*
- *"Find all contacts with incomplete profiles (missing phone or address)"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Constant Contact account (free trial or paid)
- OAuth2 application registered at https://v3.developer.constantcontact.com/

### Setup

```bash
git clone https://github.com/BusyBee3333/Constant-Contact-MCP-2026-Complete.git
cd constant-contact-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your Constant Contact access token
npm run build
npm start
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Project Structure

```
constant-contact-mcp-2026-complete/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env.example
```

## 🐛 Troubleshooting

### "Authentication failed" or "401 Unauthorized"
- Verify your access token is valid (check expiration)
- Ensure token has `contact_data` and `campaign_data` scopes
- Refresh your OAuth2 token if it expired (24-hour lifespan)
- Re-authorize your app at https://v3.developer.constantcontact.com/

### "Rate limit exceeded"
- Free trials: 10,000 calls/day
- Paid plans: Higher limits (check your account tier)
- Use pagination (`limit` parameter) and cache responses locally

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating config
- Check that the path in `claude_desktop_config.json` is absolute (not relative)
- Verify the build completed: `ls dist/index.js`
- Check Claude Desktop logs: `tail -f ~/Library/Logs/Claude/mcp*.log`

### "Invalid list ID" or "Campaign not found"
- List IDs and campaign IDs are UUIDs (e.g., `abc-123-def`)
- Get valid IDs: *"List all my contact lists"* or *"Show me recent campaigns"*
- Contact IDs are also UUIDs, not integers

### "Missing required field: physical_address_in_footer"
- CAN-SPAM compliance requires a physical address in email footers
- Include the `physical_address_in_footer` object when creating campaigns
- Or use a pre-configured account default address

## 📖 Resources

- **[Constant Contact API v3 Docs](https://developer.constantcontact.com/api_guide/index.html)** — Official API reference
- **[OAuth2 Setup Guide](https://v3.developer.constantcontact.com/api_guide/auth_overview.html)** — How to get access tokens
- **[Constant Contact Help Center](https://knowledgebase.constantcontact.com/)** — Tutorials and guides
- **[MCP Protocol Spec](https://modelcontextprotocol.io/)** — How MCP servers work
- **[Claude Desktop Docs](https://claude.ai/desktop)** — Installing and configuring Claude
- **[MCPEngage Platform](https://mcpengine.pages.dev)** — Browse 30+ business MCP servers

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/segment-builder`)
3. Commit your changes (`git commit -m 'Add contact segmentation tool'`)
4. Push to the branch (`git push origin feature/segment-builder`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for business software.

Want more MCP servers? Check out our [full catalog](https://mcpengage.com) covering 30+ business platforms including Brevo, Mailchimp, ActiveCampaign, HubSpot, and more.

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).
