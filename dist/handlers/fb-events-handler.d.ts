import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
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
export declare function fbEventsHandler(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    message: string;
    result: any;
    timestamp: string;
}> | NextResponse<{
    error: string;
    timestamp: string;
}>>;
//# sourceMappingURL=fb-events-handler.d.ts.map