'use client'

import { useSearchParams } from 'next/navigation'

export default function PublicChrome({ children }) {
  const searchParams = useSearchParams()
  if (searchParams.get('embedded') === '1') return null
  return children
}
