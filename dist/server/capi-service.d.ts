import type { FacebookEventData } from "../types.js";
/**
 * Send an event to Facebook's Conversions API (server-side).
 *
 * In development mode, logs the event and returns a mock response.
 * In production, validates data, hashes PII, and sends to Graph API.
 *
 * Required env vars: `FB_PIXEL_ACCESS_TOKEN`, `NEXT_PUBLIC_FB_PIXEL_ID`
 */
export declare function sendServerEvent(eventData: FacebookEventData): Promise<any>;
//# sourceMappingURL=capi-service.d.ts.map