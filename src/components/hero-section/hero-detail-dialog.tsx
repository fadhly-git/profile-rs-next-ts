"use client"

import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { HeroSection } from '@/types'

interface HeroDetailDialogProps {
  hero: HeroSection | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HeroDetailDialog({ hero, open, onOpenChange }: HeroDetailDialogProps) {
  if (!hero) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span>Detail Hero Section</span>
            <Badge variant="outline" className="w-fit">{hero.id}</Badge>
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap hero section
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
          <div className="space-y-6">
            {/* Konten Utama */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Konten Utama</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Headline</label>
                  <p className="text-sm font-semibold mt-1 break-words">{hero.headline}</p>
                </div>

                {hero.subheading && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subheading</label>
                    <p className="text-sm mt-1 break-words">{hero.subheading}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Background Image */}
            {hero.background_image && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gambar Latar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="aspect-video w-full sm:w-32 h-20 relative rounded border overflow-hidden">
                      <Image
                        src={hero.background_image}
                        alt="Background"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 128px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-muted-foreground break-all">
                        {hero.background_image}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => hero.background_image && window.open(hero.background_image, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Buka Gambar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call to Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tombol Call to Action</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tombol CTA 1</label>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Teks:</span>
                        <p className="text-sm break-words">{hero.cta_button_text_1 || '-'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Link:</span>
                        <p className="text-sm font-mono text-blue-600 break-all">
                          {hero.cta_button_link_1 || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tombol CTA 2</label>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Teks:</span>
                        <p className="text-sm break-words">{hero.cta_button_text_2 || '-'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Link:</span>
                        <p className="text-sm font-mono text-blue-600 break-all">
                          {hero.cta_button_link_2 || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informasi Sistem */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</label>
                    <p className="text-sm mt-1">
                      {hero.createdAt?.toLocaleString('id-ID') || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</label>
                    <p className="text-sm mt-1">
                      {hero.updatedAt?.toLocaleString('id-ID') || '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}