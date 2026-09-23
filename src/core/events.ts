export type TrackingPayload = {
  eventId: string;
  kind: 'affiliate_click' | 'outbound_click' | 'interaction';
  href?: string;
  label?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

declare global {
  interface Window {
    athenaTrack?: (payload: TrackingPayload) => void;
  }
}

export function track(payload: TrackingPayload) {
  if (typeof window === 'undefined') return;
  window.athenaTrack?.(payload);
  window.dispatchEvent(new CustomEvent('athena:track', { detail: payload }));
}
