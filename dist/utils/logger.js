const isDevelopment = process.env.NODE_ENV === "development";
export function logPixelEvent(event, data, source = "client") {
    if (isDevelopment) {
        console.log(`[next-meta-pixel] ${source} - ${event}:`, data);
    }
}
export function logPixelError(message, error, source = "client") {
    if (isDevelopment) {
        console.error(`[next-meta-pixel] ${source} - ${message}:`, error);
    }
}
export function logPixelWarning(message, source) {
    if (isDevelopment) {
        console.warn(`[next-meta-pixel] ${source ? source + " - " : ""}${message}`);
    }
}
//# sourceMappingURL=logger.js.map