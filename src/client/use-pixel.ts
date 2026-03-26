"use client";

import { useCallback } from "react";
import type { FbEventOptions } from "../types.js";
import { fbEvent } from "./fb-event.js";

/**
 * React hook for tracking Facebook Pixel + CAPI events.
 *
 * @example
 * ```tsx
 * import { usePixel } from "next-meta-pixel";
 *
 * function CheckoutButton() {
 *   const { track } = usePixel();
 *
 *   return (
 *     <button onClick={() => track({
 *       eventName: "InitiateCheckout",
 *       data: { value: 49.99, currency: "USD" },
 *     })}>
 *       Checkout
 *     </button>
 *   );
 * }
 * ```
 */
export function usePixel() {
  const track = useCallback((options: FbEventOptions) => {
    try {
      fbEvent(options);
    } catch (error) {
      console.error("[next-meta-pixel] Failed to track event:", error);
    }
  }, []);

  return { track };
}
