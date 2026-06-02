import { redirect } from 'next/navigation'

// Deck moved to /fi-epic (2026-06-01). Redirect old links.
export default function FiPage() {
  redirect('/fi-epic')
}
