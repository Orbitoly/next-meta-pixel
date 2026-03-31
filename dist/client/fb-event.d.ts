import type { FbEventOptions } from "../types.js";
/**
 * Track a Facebook event on both client (Pixel) and server (CAPI).
 *
 * - Fires `fbq('track', eventName)` on the client
 * - POSTs to your API route for server-side CAPI forwarding
 * - Auto-generates a shared eventId for deduplication
 * - Auto-extracts _fbp/_fbc cookies for better match rates
 *
 * @example
 * ```tsx
 * import { fbEvent } from "next-meta-pixel";
 *
 * // Track a lead
 * fbEvent({ eventName: "Lead", data: { content_name: "signup-form" } });
 *
 * // Track a purchase with PII for CAPI matching
 * fbEvent({
 *   eventName: "Purchase",
 *   data: { value: 29.99, currency: "USD" },
 *   emails: ["user@example.com"],
 *   phones: ["+972501234567"],
 * });
 * ```
 */
export declare function fbEvent(options: FbEventOptions): void;
//# sourceMappingURL=fb-event.d.ts.map