// components/atoms/image-preview.tsx
import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, Eye, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface ImagePreviewProps {
    src: string
    alt: string
    onRemove?: () => void
    className?: string
}

export function ImagePreview({ src, alt, onRemove, className = "" }: ImagePreviewProps) {
    const [imageError, setImageError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const handleImageError = () => {
        setImageError(true)
        setIsLoading(false)
    }

    const handleImageLoad = () => {
        setIsLoading(false)
        setImageError(false)
    }

    if (imageError) {
        return (
            <div className={`relative group bg-red-50 border-2 border-red-200 border-dashed rounded-lg p-4 ${className}`}>
                <div className="text-center text-red-600">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Invalid Image URL</p>
                    <p className="text-xs mt-1 break-all opacity-70">{src}</p>
                </div>
                {onRemove && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={onRemove}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className={`relative group ${className}`}>
            <div className="relative aspect-square w-24 h-24 border rounded-lg overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                        <div className="text-xs text-gray-500">Loading...</div>
                    </div>
                )}

                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    style={{ display: isLoading ? 'none' : 'block' }}
                />

                {/* Overlay buttons */}
                {!isLoading && !imageError && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                                <DialogTitle>
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        {alt || 'Image Preview'}
                                    </div>
                                </DialogTitle>
                                <div className="relative aspect-video rounded-lg">
                                    <Image
                                        src={src}
                                        alt={alt}
                                        fill
                                        className="object-contain rounded-lg"
                                    />
                                </div>
                                <DialogDescription className="mt-2 text-sm">
                                    {src}
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>

                        {onRemove && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                onClick={onRemove}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-500 mt-1 truncate" title={src}>
                {src}
            </p>
        </div>
    )
}