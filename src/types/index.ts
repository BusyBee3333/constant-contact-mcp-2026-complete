// Constant Contact API v3 Types

export interface ConstantContactConfig {
  accessToken: string;
  baseUrl?: string;
}

// Pagination
export interface PaginationLinks {
  next?: string;
}

export interface PaginatedResponse<T> {
  results?: T[];
  contacts?: T[];
  lists?: T[];
  segments?: T[];
  campaigns?: T[];
  pages?: T[];
  posts?: T[];
  tags?: T[];
  _links?: PaginationLinks;
}

// Contact Types
export interface ContactAddress {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface ContactPhone {
  phone_number: string;
  kind?: 'home' | 'work' | 'mobile' | 'other';
}

export interface CustomField {
  custom_field_id: string;
  value: string;
}

export interface Contact {
  contact_id?: string;
  email_address: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  company_name?: string;
  birthday_month?: number;
  birthday_day?: number;
  anniversary?: string;
  update_source?: string;
  create_source?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  list_memberships?: string[];
  taggings?: string[];
  notes?: ContactNote[];
  phone_numbers?: ContactPhone[];
  street_addresses?: ContactAddress[];
  custom_fields?: CustomField[];
  permission_to_send?: string;
  sms_permission?: string;
}

export interface ContactNote {
  note_id?: string;
  content: string;
  created_at?: string;
}

export interface ContactActivity {
  campaign_activity_id: string;
  contact_id: string;
  tracking_activity_type: string;
  created_time: string;
  campaign_id?: string;
  email_address?: string;
}

// List Types
export interface ContactList {
  list_id?: string;
  name: string;
  description?: string;
  favorite?: boolean;
  created_at?: string;
  updated_at?: string;
  membership_count?: number;
}

// Segment Types
export interface Segment {
  segment_id?: string;
  name: string;
  segment_criteria?: any;
  created_at?: string;
  updated_at?: string;
  contact_count?: number;
}

// Campaign Types
export interface EmailCampaign {
  campaign_id?: string;
  name: string;
  subject?: string;
  preheader?: string;
  from_name?: string;
  from_email?: string;
  reply_to_email?: string;
  html_content?: string;
  text_content?: string;
  current_status?: 'Draft' | 'Scheduled' | 'Sent' | 'Sending' | 'Done' | 'Error';
  created_at?: string;
  updated_at?: string;
  scheduled_date?: string;
  campaign_activities?: CampaignActivity[];
  type?: string;
}

export interface CampaignActivity {
  campaign_activity_id?: string;
  campaign_id?: string;
  role?: string;
  html_content?: string;
  subject?: string;
  from_name?: string;
  from_email?: string;
  reply_to_email?: string;
  preheader?: string;
  current_status?: string;
  contact_list_ids?: string[];
  segment_ids?: string[];
}

export interface CampaignStats {
  campaign_id: string;
  stats: {
    sends?: number;
    opens?: number;
    clicks?: number;
    bounces?: number;
    forwards?: number;
    unsubscribes?: number;
    abuse_reports?: number;
    unique_opens?: number;
    unique_clicks?: number;
    open_rate?: number;
    click_rate?: number;
  };
}

// Template Types
export interface EmailTemplate {
  template_id: string;
  name: string;
  html_content?: string;
  text_content?: string;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Reporting Types
export interface ContactStats {
  contact_id: string;
  total_sends: number;
  total_opens: number;
  total_clicks: number;
  total_bounces: number;
  last_open_date?: string;
  last_click_date?: string;
}

export interface BounceReport {
  campaign_activity_id: string;
  contact_id: string;
  email_address: string;
  bounce_code: string;
  bounce_description: string;
  bounce_time: string;
}

export interface ClickReport {
  campaign_activity_id: string;
  contact_id: string;
  email_address: string;
  url: string;
  url_id: string;
  click_time: string;
}

export interface OpenReport {
  campaign_activity_id: string;
  contact_id: string;
  email_address: string;
  open_time: string;
}

// Landing Page Types
export interface LandingPage {
  page_id?: string;
  name: string;
  description?: string;
  html_content?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'DELETED';
  created_at?: string;
  updated_at?: string;
  published_url?: string;
}

// Social Types
export interface SocialPost {
  post_id?: string;
  content: string;
  scheduled_time?: string;
  published_time?: string;
  status?: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
  platforms?: ('facebook' | 'twitter' | 'linkedin' | 'instagram')[];
  image_url?: string;
  link_url?: string;
}

// Tag Types
export interface Tag {
  tag_id?: string;
  name: string;
  tag_source?: string;
  contacts_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Import/Export Types
export interface ContactImport {
  import_id?: string;
  file_name?: string;
  status?: string;
  created_at?: string;
  row_count?: number;
  contacts_added?: number;
  contacts_updated?: number;
}

export interface ContactExport {
  export_id?: string;
  status?: string;
  created_at?: string;
  file_url?: string;
  row_count?: number;
}

// Error Types
export interface ConstantContactError {
  error_key?: string;
  error_message?: string;
}
