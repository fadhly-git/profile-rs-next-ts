"use client"

import Image from "next/image"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FormPreviewProps {
  headline: string
  subheading: string
  backgroundImage: string
  ctaText1: string
  ctaText2: string
}

export function FormPreview({
  headline,
  subheading,
  backgroundImage,
  ctaText1,
  ctaText2
}: FormPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Pratinjau Langsung
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-lg border overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700 text-white min-h-[200px]">
          {backgroundImage ? (
            <div className="absolute inset-0">
              <Image
                src={backgroundImage}
                alt="Latar belakang"
                fill
                className="object-cover opacity-60"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-80" />
          )}

          <div className="relative p-4 sm:p-6 flex flex-col justify-center min-h-[200px] z-10">
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              {headline || "Headline akan muncul di sini"}
            </h2>

            {subheading && (
              <p className="text-sm text-gray-200 mb-4">
                {subheading}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {ctaText1 && (
                <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                  {ctaText1}
                </Button>
              )}
              {ctaText2 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  {ctaText2}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}