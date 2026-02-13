#!/usr/bin/env node

import { config } from 'dotenv';
import { ConstantContactServer } from './server.js';

// Load environment variables
config();

const accessToken = process.env.CONSTANT_CONTACT_ACCESS_TOKEN;

if (!accessToken) {
  console.error('Error: CONSTANT_CONTACT_ACCESS_TOKEN environment variable is required');
  console.error('Please set it in your .env file or environment');
  process.exit(1);
}

const server = new ConstantContactServer(accessToken);

server.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
