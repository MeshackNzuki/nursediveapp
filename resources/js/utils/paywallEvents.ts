export type PaywallEventName =
    | "paywall_shown"
    | "pricing_clicked"
    | "checkout_started"
    | "payment_completed"
    | "payment_abandoned";

type PaywallEventPayload = Record<string, unknown>;

export function trackPaywallEvent(
    eventName: PaywallEventName,
    payload: PaywallEventPayload = {},
) {
    if (typeof window === "undefined") return;

    const detail = {
        event: eventName,
        timestamp: new Date().toISOString(),
        ...payload,
    };
    const browserWindow = window as Window & {
        dataLayer?: PaywallEventPayload[];
    };

    browserWindow.dataLayer?.push(detail);
    window.dispatchEvent(new CustomEvent("nursedive:paywall-event", { detail }));

    if (import.meta.env.DEV) {
        console.debug("[paywall-event]", detail);
    }
}
