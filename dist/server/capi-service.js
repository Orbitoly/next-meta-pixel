import { sendServerEventDev, isDevMode } from "./dev-capi-service.js";
const FACEBOOK_API_VERSION = "v21.0";
const FACEBOOK_API_BASE_URL = "https://graph.facebook.com";
// --- Data transformation ---
async function hashData(data) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
function formatPhoneNumber(phone) {
    return phone.replace(/[^0-9]/g, "");
}
async function transformUserData(data) {
    const userData = {};
    if (data.emails?.length) {
        userData.em = await Promise.all(data.emails.map(hashData));
    }
    if (data.phones?.length) {
        userData.ph = await Promise.all(data.phones.map((phone) => hashData(formatPhoneNumber(phone))));
    }
    if (data.firstName)
        userData.fn = await hashData(data.firstName);
    if (data.lastName)
        userData.ln = await hashData(data.lastName);
    if (data.country)
        userData.country = await hashData(data.country);
    if (data.city)
        userData.ct = await hashData(data.city);
    if (data.zipCode)
        userData.zp = await hashData(data.zipCode);
    if (data.userAgent)
        userData.client_user_agent = data.userAgent;
    return userData;
}
function transformCustomData(data) {
    const customData = {};
    if (data.products?.length) {
        customData.content_type = "product";
        customData.contents = data.products.map((product) => ({
            id: product.sku,
            quantity: product.quantity,
        }));
    }
    if (data.value)
        customData.value = data.value;
    if (data.currency)
        customData.currency = data.currency;
    if (data.sourceUrl)
        customData.source_url = data.sourceUrl;
    return customData;
}
// --- Validation ---
function validateCustomerData(data) {
    const hasEmail = Array.isArray(data.emails) && data.emails.length > 0;
    const hasPhone = Array.isArray(data.phones) && data.phones.length > 0;
    const hasName = data.firstName && data.lastName;
    const hasLocation = data.city && data.country;
    const hasZip = data.zipCode;
    const hasFbCookies = data.fbp || data.fbc;
    if (!hasEmail &&
        !hasPhone &&
        !hasName &&
        !(hasLocation && hasZip) &&
        !hasFbCookies) {
        return {
            isValid: false,
            error: "Insufficient customer data. Provide at least one of: email, phone, full name, location (city + country + zip), or fbp/fbc cookie.",
        };
    }
    return { isValid: true };
}
async function createEventPayload(data) {
    const userData = await transformUserData(data);
    if (data.fbp)
        userData.fbp = data.fbp;
    if (data.fbc)
        userData.fbc = data.fbc;
    return {
        event_name: data.eventName,
        event_id: data.eventId,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: userData,
        custom_data: transformCustomData(data),
    };
}
// --- Main export ---
/**
 * Send an event to Facebook's Conversions API (server-side).
 *
 * In development mode, logs the event and returns a mock response.
 * In production, validates data, hashes PII, and sends to Graph API.
 *
 * Required env vars: `FB_PIXEL_ACCESS_TOKEN`, `NEXT_PUBLIC_FB_PIXEL_ID`
 */
export async function sendServerEvent(eventData) {
    if (isDevMode()) {
        return sendServerEventDev(eventData);
    }
    const accessToken = process.env.FB_PIXEL_ACCESS_TOKEN;
    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    if (!accessToken || !pixelId) {
        throw new Error("[next-meta-pixel] Missing FB_PIXEL_ACCESS_TOKEN or NEXT_PUBLIC_FB_PIXEL_ID");
    }
    if (!eventData.eventName || !eventData.eventId) {
        throw new Error("[next-meta-pixel] Missing required eventName or eventId");
    }
    const validation = validateCustomerData(eventData);
    if (!validation.isValid) {
        throw new Error(`[next-meta-pixel] ${validation.error}`);
    }
    const payload = {
        data: [await createEventPayload(eventData)],
        access_token: accessToken,
        ...(eventData.testEventCode && {
            test_event_code: eventData.testEventCode,
        }),
    };
    const response = await fetch(`${FACEBOOK_API_BASE_URL}/${FACEBOOK_API_VERSION}/${pixelId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
        console.error("[next-meta-pixel] Facebook API error:", result);
        throw new Error(`[next-meta-pixel] Facebook API error: ${JSON.stringify(result)}`);
    }
    return result;
}
//# sourceMappingURL=capi-service.js.map