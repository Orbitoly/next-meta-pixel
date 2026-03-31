import { NextResponse } from "next/server";
import { sendServerEvent } from "../server/capi-service.js";
/**
 * Next.js App Router API route handler for Facebook Conversions API.
 *
 * In development, skips the Facebook API call and returns a mock response.
 * In production, forwards the event to Facebook's Conversions API.
 *
 * @example
 * ```ts
 * // app/api/fb-events/route.ts
 * import { fbEventsHandler } from "next-meta-pixel/handlers";
 * export const POST = fbEventsHandler;
 * ```
 */
export async function fbEventsHandler(req) {
    try {
        const eventData = await req.json();
        console.log("[next-meta-pixel] Processing server event:", {
            eventName: eventData.eventName,
            eventId: eventData.eventId,
            timestamp: new Date().toISOString(),
        });
        const result = await sendServerEvent(eventData);
        return NextResponse.json({
            success: true,
            message: "Event sent to Facebook Conversions API",
            result,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("[next-meta-pixel] Server event failed:", error);
        return NextResponse.json({
            error: "Failed to send event",
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
//# sourceMappingURL=fb-events-handler.js.map