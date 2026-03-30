import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Redirecting -- Ryan Stern',
  robots: { index: false },
}

export default function InvestPage() {
  redirect('/work-with-me')
}
