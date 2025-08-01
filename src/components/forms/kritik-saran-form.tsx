'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { submitKritikSaran } from '@/lib/actions/kritik-saran'

const kritikSaranSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi').max(100, 'Nama maksimal 100 karakter'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid').max(100, 'Email maksimal 100 karakter'),
  telepon: z.string().optional(),
  alamat: z.string().min(1, 'Alamat wajib diisi').max(255, 'Alamat maksimal 255 karakter'),
  nama_kmr_no_kmr: z.string().optional(),
  nama_poli: z.string().optional(),
  perawatan_terakait: z.enum(['Poliklinik', 'RawatInap'], {
    error: 'Pilih jenis perawatan'
  }),
  kritik: z.string().min(1, 'Kritik wajib diisi'),
  saran: z.string().min(1, 'Saran wajib diisi')
})

type KritikSaranFormData = z.infer<typeof kritikSaranSchema>

export function KritikSaranForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm<KritikSaranFormData>({
    resolver: zodResolver(kritikSaranSchema),
    defaultValues: {
      nama: '',
      email: '',
      telepon: '',
      alamat: '',
      nama_kmr_no_kmr: '',
      nama_poli: '',
      perawatan_terakait: 'Poliklinik',
      kritik: '',
      saran: ''
    }
  })

  const onSubmit = async (data: KritikSaranFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitStatus('idle')
      setErrorMessage('')

      const result = await submitKritikSaran(data)

      if (result.success) {
        setSubmitStatus('success')
        form.reset()
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.message || 'Terjadi kesalahan saat mengirim data')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      setErrorMessage('Terjadi kesalahan sistem. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Success Alert */}
      {submitStatus === 'success' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Terima kasih! Kritik dan saran Anda telah berhasil dikirim. Kami akan menindaklanjuti masukan Anda.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Nama */}
        <div className="space-y-2">
          <Label htmlFor="nama">Nama Lengkap *</Label>
          <Input
            id="nama"
            {...form.register('nama')}
            placeholder="Masukkan nama lengkap"
            className="focus:border-[#07b8b2] focus:ring-[#07b8b2]"
          />
          {form.formState.errors.nama && (
            <p className="text-sm text-red-600">{form.formState.errors.nama.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="nama@email.com"
            className="focus:border-[#07b8b2] focus:ring-[#07b8b2]"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Telepon */}
        <div className="space-y-2">
          <Label htmlFor="telepon">Nomor Telepon</Label>
          <Input
            id="telepon"
            {...form.register('telepon')}
            placeholder="08xxxxxxxxxx"
            className="focus:border-[#07b8b2] focus:ring-[#07b8b2]"
          />
          {form.formState.errors.telepon && (
            <p className="text-sm text-red-600">{form.formState.errors.telepon.message}</p>
          )}
        </div>

        {/* Alamat */}
        <div className="space-y-2">
          <Label htmlFor="alamat">Alamat *</Label>
          <Input
            id="alamat"
            {...form.register('alamat')}
            placeholder="Alamat lengkap"
            className="focus:border-[#07b8b2] focus:ring-[#07b8b2]"
          />
          {form.formState.errors.alamat && (
            <p className="text-sm text-red-600">{form.formState.errors.alamat.message}</p>
          )}
        </div>
      </div>

      {/* Jenis Perawatan */}
      <div className="space-y-3">
        <Label>Jenis Perawatan Terkait *</Label>
        <RadioGroup
          value={form.watch('perawatan_terakait')}
          onValueChange={(value) => form.setValue('perawatan_terakait', value as 'Poliklinik' | 'RawatInap')}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Poliklinik" id="poliklinik" />
            <Label htmlFor="poliklinik">Poliklinik</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="RawatInap" id="rawat-inap" />
            <Label htmlFor="rawat-inap">Rawat Inap</Label>
          </div>
        </RadioGroup>
        {form.formState.errors.perawatan_terakait && (
          <p className="text-sm text-red-600">{form.formState.errors.perawatan_terakait.message}</p>
        )}
      </div>

      {/* Detail Perawatan */}
      {form.watch('perawatan_terakait') === 'Poliklinik' && (
        <div className="space-y-2">
          <Label htmlFor="nama_poli">Nama Poliklinik</Label>
          <Input
            id="nama_poli"
            {...form.register('nama_poli')}
            placeholder="Contoh: Poli Jantung, Poli Anak, dll"
            className="focus:border-[#07b8b2] focus:ring-[#07b8b2]"
          />
        </div>
      )}

      {form.watch('perawatan_terakait') === 'RawatInap' && (
        <div className="space-y-2">
          <Label htmlFor="nama_kmr_no_kmr">Nama/Nomor Kamar</Label>
          <Input
            id="nama_kmr_no_kmr"
            {...form.register('nama_kmr_no_kmr')}
            placeholder="Contoh: Kamar 201, VIP A, dll"
            className="focus:border-[#07b8b2] focus:ring-[#07b8b2]"
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Kritik */}
        <div className="space-y-2">
          <Label htmlFor="kritik">Kritik *</Label>
          <Textarea
            id="kritik"
            {...form.register('kritik')}
            placeholder="Sampaikan kritik Anda..."
            rows={4}
            className="focus:border-[#07b8b2] focus:ring-[#07b8b2] resize-none"
          />
          {form.formState.errors.kritik && (
            <p className="text-sm text-red-600">{form.formState.errors.kritik.message}</p>
          )}
        </div>

        {/* Saran */}
        <div className="space-y-2">
          <Label htmlFor="saran">Saran *</Label>
          <Textarea
            id="saran"
            {...form.register('saran')}
            placeholder="Sampaikan saran Anda..."
            rows={4}
            className="focus:border-[#07b8b2] focus:ring-[#07b8b2] resize-none"
          />
          {form.formState.errors.saran && (
            <p className="text-sm text-red-600">{form.formState.errors.saran.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-600">
              * Field yang wajib diisi. Dengan mengirim form ini, Anda menyetujui bahwa data akan digunakan untuk keperluan evaluasi dan perbaikan layanan rumah sakit.
            </p>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#07b8b2] hover:bg-teal-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim Kritik dan Saran'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}