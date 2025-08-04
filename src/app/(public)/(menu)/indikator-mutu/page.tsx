// pages/indikator-mutu.tsx atau app/indikator-mutu/page.tsx

import { IndikatorMutuPage } from '@/components/indikator-mutu-page'
import { getIndikatorMutu } from '@/lib/actions/indikator-mutu'

export default async function IndikatorMutuPageWrapper() {
  const data = await getIndikatorMutu();
  
  return (
    <div className="container mx-auto p-6">
      <IndikatorMutuPage data={data} />
    </div>
  )
}