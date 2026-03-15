/** Product data for e-commerce events */
export interface Product {
  sku: string;
  quantity: number;
}

/** Event data sent to both client-side Pixel and server-side CAPI */
export interface FacebookEventData {
  [key: string]: unknown;
  /** Facebook standard or custom event name (e.g., "Lead", "Purchase", "ViewContent") */
  eventName: string;
  /** Unique event ID for deduplication between Pixel and CAPI */
  eventId: string;
  /** User email addresses (hashed before sending to Facebook) */
  emails?: string[];
  /** User phone numbers (hashed before sending to Facebook) */
  phones?: string[];
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  products?: Product[];
  value?: number;
  currency?: string;
  userAgent?: string;
  sourceUrl?: string;
  /** Facebook test event code for development/testing */
  testEventCode?: string;
  /** Facebook Browser ID cookie (_fbp) */
  fbp?: string;
  /** Facebook Click ID cookie (_fbc) */
  fbc?: string;
}

/** Options for fbEvent() — the main client-side tracking function */
export interface FbEventOptions {
  /** Facebook standard or custom event name */
  eventName: string;
  /** Additional event data */
  data?: Record<string, unknown>;
  /** User email addresses for CAPI matching */
  emails?: string[];
  /** User phone numbers for CAPI matching */
  phones?: string[];
  firstName?: string;
  lastName?: string;
  /** API endpoint URL for CAPI (default: "/api/fb-events") */
  apiRoute?: string;
}

/** Internal Facebook user data payload (hashed PII) */
export interface FacebookUserData {
  em?: string[];
  ph?: string[];
  fn?: string;
  ln?: string;
  country?: string;
  ct?: string;
  zp?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
}

/** Internal Facebook custom data payload */
export interface FacebookCustomData {
  content_type?: string;
  contents?: Array<{ id: string; quantity: number }>;
  value?: number;
  currency?: string;
  source_url?: string;
}

/** Internal Facebook event payload sent to Graph API */
export interface FacebookEventPayload {
  event_name: string;
  event_id: string;
  event_time: number;
  action_source: string;
  user_data: FacebookUserData;
  custom_data: FacebookCustomData;
}
