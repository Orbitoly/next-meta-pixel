"use client";
import { logPixelEvent, logPixelWarning } from "../utils/logger.js";
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
export function isPixelInitialized() {
    return typeof window !== "undefined" && typeof window.fbq !== "undefined";
}
/** Track a PageView event (called automatically by PixelPageView on route changes) */
export function trackPageView(pathname, searchParams) {
    if (!isPixelInitialized()) {
        logPixelWarning("fbq is not initialized", "client");
        return;
    }
    window.fbq("track", "PageView");
    logPixelEvent("PageView", {
        pathname,
        searchParams: Object.fromEntries(searchParams.entries()),
    });
}
/** Track a standard Facebook event (e.g., "Lead", "Purchase", "ViewContent") */
export function trackStandardEvent(name, options = {}, eventID) {
    if (!isPixelInitialized()) {
        logPixelWarning("fbq is not initialized", "client");
        return;
    }
    const eventOptions = eventID ? { ...options, eventID } : options;
    window.fbq("track", name, eventOptions);
    logPixelEvent(`Standard event: ${name}`, { eventID, ...options });
}
/** Track a custom Facebook event with deduplication eventID */
export function trackCustomEvent(name, options = {}, eventID) {
    if (!isPixelInitialized()) {
        logPixelWarning("fbq is not initialized", "client");
        return;
    }
    window.fbq("trackCustom", name, { ...options, eventID });
    logPixelEvent(`Custom event: ${name}`, { eventID, ...options });
}
//# sourceMappingURL=fb-pixel-client.js.map