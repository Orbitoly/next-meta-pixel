/** Get the Facebook Browser ID (_fbp) cookie */
export declare function getFbpCookie(): string | null;
/** Get the Facebook Click ID (_fbc) cookie */
export declare function getFbcCookie(): string | null;
/**
 * Get both _fbp and _fbc cookies.
 * In development, falls back to generated cookies if real ones aren't available.
 */
export declare function getFbCookies(): {
    fbp: string | null;
    fbc: string | null;
};
//# sourceMappingURL=cookies.d.ts.map