import type { FacebookEventData } from "../types.js";
/**
 * Development-mode CAPI handler.
 * Logs the event data and returns a mock Facebook API response.
 */
export declare function sendServerEventDev(eventData: FacebookEventData): Promise<{
    events_received: number;
    messages: never[];
    fbtrace_id: string;
}>;
export declare function isDevMode(): boolean;
//# sourceMappingURL=dev-capi-service.d.ts.map