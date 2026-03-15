// Components
export { FacebookPixel } from "./client/FacebookPixel";
export { PixelPageView } from "./client/PixelPageView";

// Client tracking
export { fbEvent } from "./client/fb-event";
export { usePixel } from "./client/use-pixel";
export {
  trackPageView,
  trackStandardEvent,
  trackCustomEvent,
  isPixelInitialized,
  FB_PIXEL_ID,
} from "./client/fb-pixel-client";

// Types
export type {
  FacebookEventData,
  FbEventOptions,
  Product,
} from "./types";
