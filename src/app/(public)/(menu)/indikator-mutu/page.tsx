// pages/indikator-mutu.tsx atau app/indikator-mutu/page.tsx
'use client'
import { IndikatorMutuPage } from '@/components/indikator-mutu-page'
import { IndikatorMutu } from '@/types'

// Data contoh sesuai dengan yang Anda berikan

import { useEffect, useState } from 'react'

export default function IndikatorMutuPageWrapper() {
  const [data, setData] = useState<IndikatorMutu[]>([])

  useEffect(() => {
    fetch('/api/test-db')
      .then(response => response.json())
      .then((data: IndikatorMutu[]) => setData(data))
  }, [])

  return (
    <div className="container mx-auto p-6">
      <IndikatorMutuPage data={data} />
    </div>
  )
}