// components/molecules/image-selector.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ImagePreview } from '@/components/atoms/image-preview'
import { MediaBrowser } from './media-browser'
import { Image as ImageIcon, Plus } from 'lucide-react'

interface ImageSelectorProps {
    label: string
    value: string
    onChange: (url: string) => void
    helperText?: string
    required?: boolean
}

export function ImageSelector({
    label,
    value,
    onChange,
    helperText,
    required
}: ImageSelectorProps) {
    const handleRemove = () => {
        onChange('')
    }

    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            <div className="flex items-start gap-4">
                {value && (
                    <ImagePreview
                        src={value}
                        alt={label}
                        onRemove={handleRemove}
                        className="flex-shrink-0"
                    />
                )}

                <MediaBrowser
                    onSelect={onChange}
                    selectedUrl={value}
                    trigger={
                        <Button type="button" variant="outline" size="sm">
                            {value ? (
                                <>
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Change Image
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Select Image
                                </>
                            )}
                        </Button>
                    }
                />
            </div>

            {helperText && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    )
}