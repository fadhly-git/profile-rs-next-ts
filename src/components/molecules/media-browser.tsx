// components/molecules/media-browser.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Search, Upload, Link2, Check, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { LoadingSpinner } from '@/components/atoms/loading-spinner'
import { isValidImageUrl } from '@/lib/validators'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Separator } from '../ui/separator'

interface MediaFile {
    id: string
    filename: string
    url: string
    size: number
    type: string
    category: string
    createdAt: string
}

interface MediaBrowserProps {
    onSelect: (url: string) => void
    selectedUrl?: string
    allowedTypes?: string[]
    trigger?: React.ReactNode
}

export function MediaBrowser({
    onSelect,
    selectedUrl,
    allowedTypes = ['image/*'],
    trigger
}: MediaBrowserProps) {
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState<MediaFile[]>([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [customUrl, setCustomUrl] = useState('')
    const [selectedFile, setSelectedFile] = useState<string | null>(selectedUrl || null)

    const fetchFiles = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/media/list')
            const data = await response.json()
            if (data.success) {
                setFiles(data.files)
            }
        } catch (error) {
            console.error('Error fetching files:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (open) {
            fetchFiles()
        }
    }, [open])

    const handleUpload = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return

        setUploading(true)
        const formData = new FormData()

        Array.from(fileList).forEach(file => {
            formData.append('files', file)
        })
        formData.append('category', 'website-settings')

        try {
            const response = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formData,
            })
            const data = await response.json()

            if (data.success && data.uploadedFiles.length > 0) {
                await fetchFiles()
                setSelectedFile(data.uploadedFiles[0].url)
            }
        } catch (error) {
            console.error('Error uploading file:', error)
        } finally {
            setUploading(false)
        }
    }

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const categories = ['all', ...Array.from(new Set(files.map(file => file.category)))]

    const handleSelect = () => {
        if (selectedFile) {
            onSelect(selectedFile)
            setOpen(false)
        }
    }

    const handleCustomUrlSelect = () => {
        if (customUrl.trim()) {
            onSelect(customUrl.trim())
            setOpen(false)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Byte'
        const k = 1024
        const sizes = ['Byte', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" type="button">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Telusuri Media
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="!max-w-5xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Pilih Media</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="gallery" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="gallery">Galeri Media</TabsTrigger>
                        <TabsTrigger value="upload">Unggah Baru</TabsTrigger>
                        <TabsTrigger value="url">URL Kustom</TabsTrigger>
                    </TabsList>

                    <TabsContent value="gallery" className="space-y-4">
                        <div className="flex gap-4 items-end">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari file..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="min-w-[180px]">
                                <Label htmlFor="category-select" className="mb-1 block">Kategori</Label>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger id="category-select" className="w-full">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category} value={category}>
                                                {category === 'all' ? 'Semua Kategori' : category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <LoadingSpinner />
                                    <span className="ml-2">Memuat file...</span>
                                </div>
                            ) : filteredFiles.length === 0 ? (
                                <div className="text-center py-8">
                                    <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                                    <p>Tidak ada file ditemukan</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-4">
                                    {filteredFiles.map(file => (
                                        <Card
                                            key={file.url}
                                            className={`cursor-pointer transition-all hover:shadow-md ${selectedFile === file.url ? 'ring-2 ring-blue-500' : ''
                                                }`}
                                            onClick={() => setSelectedFile(file.url)}
                                        >
                                            <CardContent className="p-3">
                                                <div className="relative aspect-square mb-2">
                                                    <Image
                                                        src={file.url}
                                                        alt={file.filename}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                    {selectedFile === file.url && (
                                                        <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                                                            <Check className="h-3 w-3" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-medium truncate text-sm" title={file.filename}>
                                                        {file.filename}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {file.category}
                                                        </Badge>
                                                        <span className="text-xs">
                                                            {formatFileSize(file.size)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedFile && (
                            <div className="flex justify-between items-center p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12">
                                        {isValidImageUrl(selectedFile) ? (
                                            <Image
                                                src={selectedFile}
                                                alt="Terpilih"
                                                fill
                                                className="object-cover rounded"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded">
                                                <ImageIcon className="h-6 w-6 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Terpilih:</p>
                                        <p className="text-sm ">{selectedFile}</p>
                                    </div>
                                </div>
                                <Button onClick={handleSelect}>
                                    Pilih Gambar
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-4">
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <Upload className="mx-auto h-12 w-12 mb-4" />

                                {uploading ? (
                                    <div className="flex items-center justify-center">
                                        <LoadingSpinner />
                                        <span className="ml-2">Mengunggah...</span>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="file"
                                            accept={allowedTypes.join(',')}
                                            onChange={(e) => handleUpload(e.target.files)}
                                            className="hidden"
                                            id="file-upload"
                                            multiple
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
                                        >
                                            Klik untuk unggah atau tarik dan jatuhkan
                                        </label>
                                        <p className="text-sm text-gray-500 mt-2">
                                            PNG, JPG, WEBP, SVG maksimal 5MB per file
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="text-sm p-3 rounded-lg">
                                <p className="font-medium mb-1">Catatan:</p>
                                <p>File akan diunggah ke kategori &quot;website-settings&quot;.</p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="custom-url">Masukkan URL Gambar</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="custom-url"
                                        placeholder="https://contoh.com/gambar.jpg atau /uploads/gambar.jpg"
                                        value={customUrl}
                                        onChange={(e) => setCustomUrl(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={handleCustomUrlSelect}
                                        disabled={!customUrl.trim() || !isValidImageUrl(customUrl)}
                                    >
                                        <Link2 className="h-4 w-4 mr-2" />
                                        Gunakan URL
                                    </Button>
                                </div>
                            </div>

                            {customUrl && !isValidImageUrl(customUrl) && (
                                <p className="text-sm text-red-500 mt-1">Please enter a valid URL</p>
                            )}

                            {customUrl && isValidImageUrl(customUrl) && (
                                <div className="p-4 rounded-lg">
                                    <p className="text-sm font-medium mb-2">Pratinjau:</p>
                                    <div className="relative w-32 h-32 border rounded">
                                        <Image
                                            src={customUrl}
                                            alt="Pratinjau URL"
                                            fill
                                            className="object-cover rounded"
                                            onError={() => console.log('URL gambar tidak valid')}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="text-sm p-3 rounded-lg">
                                <p className="font-medium mb-1">Format yang didukung:</p>
                                <ul className="list-disc ml-4 space-y-1">
                                    <li>URL penuh: https://contoh.com/gambar.jpg</li>
                                    <li>Path relatif: /uploads/images/logo.png</li>
                                    <li>Format didukung: JPG, PNG, WEBP, GIF</li>
                                </ul>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
                <Separator />
                <DialogDescription className="mt-4 text-sm">
                    Pilih gambar dari galeri, unggah file baru, atau masukkan URL gambar kustom. Setelah memilih, klik &quot;Pilih Gambar&quot; untuk mengonfirmasi pilihan Anda.
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}