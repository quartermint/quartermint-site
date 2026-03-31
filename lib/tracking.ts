import { track } from '@vercel/analytics'

/**
 * Send a visitor event to both Vercel Analytics (aggregated)
 * and our Redis visitor log (per-visitor journey).
 */
export function trackEvent(action: string, label: string = '') {
  // Vercel Analytics (aggregated dashboard)
  track(action, { label })

  // Redis visitor log (per-visitor journey)
  fetch('/api/visitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: { action, label } }),
  }).catch(() => {})
}

/**
 * Capture first-touch attribution on page load.
 * Call once from a client component mounted in the layout.
 */
export function captureAttribution() {
  const url = new URL(window.location.href)
  const referrer = document.referrer || null

  const payload: Record<string, string | null> = {}
  if (referrer) payload.referrer = referrer

  const utmSource = url.searchParams.get('utm_source')
  const utmMedium = url.searchParams.get('utm_medium')
  const utmCampaign = url.searchParams.get('utm_campaign')
  if (utmSource) payload.utmSource = utmSource
  if (utmMedium) payload.utmMedium = utmMedium
  if (utmCampaign) payload.utmCampaign = utmCampaign

  // Always fire on load to capture geo + increment visits
  fetch('/api/visitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}
