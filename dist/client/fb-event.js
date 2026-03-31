"use client";
import { getFbCookies } from "../utils/cookies.js";
import { generateUUID } from "../utils/uuid.js";
import { logPixelEvent, logPixelError } from "../utils/logger.js";
import { trackStandardEvent } from "./fb-pixel-client.js";
const DEFAULT_API_ROUTE = "/api/fb-events";
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
export function fbEvent(options) {
    const { eventName, data = {}, emails, phones, firstName, lastName, apiRoute = DEFAULT_API_ROUTE, } = options;
    if (!eventName) {
        logPixelError("fbEvent called without eventName", undefined, "client");
        return;
    }
    const eventId = generateUUID();
    const { fbp, fbc } = getFbCookies();
    // Build the full event data
    const eventData = {
        eventName,
        eventId,
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
        sourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
        ...data,
        ...(emails && { emails }),
        ...(phones && { phones }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(fbp && { fbp }),
        ...(fbc && { fbc }),
    };
    // 1. Client-side: fire Pixel event
    try {
        trackStandardEvent(eventName, data, eventId);
        logPixelEvent(`Tracked: ${eventName}`, { eventId }, "client");
    }
    catch (error) {
        logPixelError(`Failed client tracking: ${eventName}`, error, "client");
    }
    // 2. Server-side: fire-and-forget POST to CAPI API route
    fetch(apiRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
    })
        .then((res) => {
        if (!res.ok) {
            logPixelError(`CAPI route returned ${res.status}`, undefined, "server");
        }
        else {
            logPixelEvent(`CAPI sent: ${eventName}`, { eventId }, "server");
        }
    })
        .catch((error) => {
        logPixelError(`CAPI request failed: ${eventName}`, error, "server");
    });
}
//# sourceMappingURL=fb-event.js.map