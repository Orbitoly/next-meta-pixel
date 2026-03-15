# next-meta-pixel

Facebook Pixel + Conversions API (CAPI) for Next.js App Router.

Dual client/server event tracking with automatic deduplication, PII hashing, and TypeScript support.

## Features

- **Pixel + CAPI** — Send events to both browser and server for maximum attribution
- **Auto-deduplication** — Shared event IDs prevent double-counting
- **PII hashing** — SHA256 hashing of emails, phones, names before sending to Meta
- **App Router** — Built for Next.js 13+ App Router with `"use client"` components
- **TypeScript** — Full type safety with exported interfaces
- **Dev mode** — Mock responses and fallback cookies in development
- **Zero dependencies** — Only `next` and `react` as peer deps

## Quick Start

### 1. Install

```bash
npm install next-meta-pixel
```

### 2. Add environment variables

```bash
# .env.local
NEXT_PUBLIC_FB_PIXEL_ID=123456789       # Your Pixel ID
FB_PIXEL_ACCESS_TOKEN=EAAx...           # Access token (for CAPI, server-side only)
```

### 3. Add to your layout

```tsx
// app/layout.tsx
import { FacebookPixel, PixelPageView } from "next-meta-pixel";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <FacebookPixel />
        <PixelPageView />
      </body>
    </html>
  );
}
```

### 4. Create the API route (for CAPI)

```ts
// app/api/fb-events/route.ts
import { fbEventsHandler } from "next-meta-pixel/handlers";
export const POST = fbEventsHandler;
```

### 5. Track events

```tsx
import { fbEvent } from "next-meta-pixel";

// Track a lead
fbEvent({ eventName: "Lead" });

// Track with data + PII for better CAPI matching
fbEvent({
  eventName: "Lead",
  data: { content_name: "signup-form" },
  emails: ["user@example.com"],
  phones: ["+972501234567"],
});
```

## API Reference

### Components

#### `<FacebookPixel />`

Loads the Facebook Pixel script. Add once in your root layout.

#### `<PixelPageView />`

Tracks `PageView` on every route change. Add alongside `<FacebookPixel />`.

### Client Functions

#### `fbEvent(options)`

Track an event on both Pixel (client) and CAPI (server).

```ts
fbEvent({
  eventName: "Purchase",          // Required — standard or custom event name
  data: {                         // Optional — event parameters
    value: 29.99,
    currency: "USD",
  },
  emails: ["user@example.com"],   // Optional — hashed and sent via CAPI
  phones: ["+1234567890"],        // Optional — hashed and sent via CAPI
  firstName: "John",              // Optional
  lastName: "Doe",                // Optional
  apiRoute: "/api/fb-events",     // Optional — default: "/api/fb-events"
});
```

Facebook standard events: `Lead`, `Purchase`, `AddToCart`, `InitiateCheckout`, `ViewContent`, `CompleteRegistration`, `Subscribe`, `Search`, etc.

#### `usePixel()`

React hook wrapper for `fbEvent`.

```tsx
const { track } = usePixel();
track({ eventName: "AddToCart", data: { value: 19.99 } });
```

#### `trackStandardEvent(name, options?, eventID?)`

Low-level: fires `fbq('track', ...)` only (no CAPI).

#### `trackCustomEvent(name, options, eventID)`

Low-level: fires `fbq('trackCustom', ...)` only (no CAPI).

### Server Functions

#### `sendServerEvent(eventData)`

Send an event directly to Facebook's Conversions API. Use this for server-side events (e.g., in API routes or Server Actions).

```ts
import { sendServerEvent } from "next-meta-pixel/server";

await sendServerEvent({
  eventName: "Lead",
  eventId: "unique-uuid",
  emails: ["user@example.com"],
  phones: ["+972501234567"],
  sourceUrl: "https://example.com/form",
});
```

### Handler

#### `fbEventsHandler`

Pre-built Next.js POST handler for the CAPI API route.

```ts
// app/api/fb-events/route.ts
import { fbEventsHandler } from "next-meta-pixel/handlers";
export const POST = fbEventsHandler;
```

## Environment Variables

| Variable | Required | Side | Description |
|---|---|---|---|
| `NEXT_PUBLIC_FB_PIXEL_ID` | Yes | Client + Server | Your Facebook Pixel ID |
| `FB_PIXEL_ACCESS_TOKEN` | For CAPI | Server only | [System User access token](https://developers.facebook.com/docs/marketing-api/conversions-api/get-started/#access-token) |
| `FB_TEST_EVENT_CODE` | No | Server only | [Test event code](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api#testEvents) for development |

## How Deduplication Works

When you call `fbEvent()`:

1. A unique `eventId` (UUID v4) is generated
2. The same `eventId` is sent to **both**:
   - Client: `fbq('track', 'Lead', { eventID: '...' })`
   - Server: POST `/api/fb-events` → Facebook CAPI with `event_id: '...'`
3. Facebook matches the two events by `event_id` and counts them once

This ensures you get the best of both worlds — immediate client-side tracking plus reliable server-side attribution.

## Cookie Consent

This package does **not** enforce cookie consent. If you need consent gating, conditionally render the components:

```tsx
function Layout({ children }) {
  const hasConsent = useCookieConsent(); // your consent hook

  return (
    <>
      {children}
      {hasConsent && <FacebookPixel />}
      {hasConsent && <PixelPageView />}
    </>
  );
}
```

The `fbEvent()` function will silently no-op if the pixel script hasn't been loaded.

## CSP (Content Security Policy)

If you use CSP headers, add these domains:

```
script-src: https://connect.facebook.net
connect-src: https://connect.facebook.net https://www.facebook.com
img-src: https://www.facebook.com
```

## Development Mode

In development (`NODE_ENV=development`):

- The API route handler returns mock responses (no real Facebook API calls)
- Missing `_fbp`/`_fbc` cookies are replaced with realistic fallbacks
- All events are logged to the console with `[next-meta-pixel]` prefix
- Set `FB_TEST_EVENT_CODE` to test with Facebook's [Test Events tool](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api#testEvents)

## License

MIT
