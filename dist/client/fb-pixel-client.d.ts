export declare const FB_PIXEL_ID: string | undefined;
declare global {
    interface Window {
        fbq: (...args: any[]) => void;
        _fbq: (...args: any[]) => void;
    }
}
export declare function isPixelInitialized(): boolean;
/** Track a PageView event (called automatically by PixelPageView on route changes) */
export declare function trackPageView(pathname: string, searchParams: {
    entries(): IterableIterator<[string, string]>;
}): void;
/** Track a standard Facebook event (e.g., "Lead", "Purchase", "ViewContent") */
export declare function trackStandardEvent(name: string, options?: Record<string, unknown>, eventID?: string): void;
/** Track a custom Facebook event with deduplication eventID */
export declare function trackCustomEvent(name: string, options: Record<string, unknown> | undefined, eventID: string): void;
//# sourceMappingURL=fb-pixel-client.d.ts.map