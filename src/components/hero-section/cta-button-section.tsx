"use client"

import { CheckCircle2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CtaButtonSectionProps {
  number: 1 | 2
  textValue: string
  linkValue: string
  onTextChange: (value: string) => void
  onLinkChange: (value: string) => void
  required?: boolean
}

export function CtaButtonSection({
  number,
  textValue,
  linkValue,
  onTextChange,
  onLinkChange,
  required = false
}: CtaButtonSectionProps) {
  const isValidUrl = (url: string) => {
    if (!url) return true
    if (url.startsWith('/') || url.startsWith('#')) return true
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const ctaType = number === 1 ? 'Primary' : 'Secondary'
  const placeholder = {
    text: number === 1 ? "Jadwalkan Konsultasi" : "Lihat Layanan",
    link: number === 1 ? "/konsultasi atau https://wa.me/..." : "/layanan atau #section"
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Badge variant="outline">CTA {number} ({ctaType})</Badge>
        {number === 2 && (
          <span className="text-xs text-muted-foreground">- Opsional</span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`cta_button_text_${number}`}>
            Teks Tombol {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={`cta_button_text_${number}`}
            name={`cta_button_text_${number}`}
            placeholder={placeholder.text}
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            required={required}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`cta_button_link_${number}`}>
            Link Tujuan {required && <span className="text-red-500">*</span>}
          </Label>
          <div className="relative">
            <Input
              id={`cta_button_link_${number}`}
              name={`cta_button_link_${number}`}
              placeholder={placeholder.link}
              value={linkValue}
              onChange={(e) => onLinkChange(e.target.value)}
              required={required}
            />
            {linkValue && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {isValidUrl(linkValue) ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {textValue && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-sm text-muted-foreground">Pratinjau:</span>
          <Button 
            size="sm" 
            variant={number === 1 ? "default" : "outline"}
            className="pointer-events-none w-fit"
          >
            {textValue}
          </Button>
        </div>
      )}
    </div>
  )
}