"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import Image from 'next/image';

interface PreviewData {
    judul_berita: string;
    isi: string;
    thumbnail: string;
    gambar: string;
    jenis_berita: string;
    bahasa: string;
    keywords: string;
    tanggal_post: string;
}

export default function PreviewPage() {
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);

    useEffect(() => {
        const data = localStorage.getItem('preview_berita');
        if (data) {
            setPreviewData(JSON.parse(data));
        }
    }, []);

    if (!previewData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card>
                    <CardContent className="p-6">
                        <p>Data preview tidak ditemukan.</p>
                        <Button onClick={() => window.close()} className="mt-4">
                            Tutup
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => window.close()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Tutup Preview
                    </Button>
                </div>

                <article className="bg-card rounded-lg shadow-sm overflow-hidden">
                    {/* Header Image */}
                    {(previewData.thumbnail || previewData.gambar) && (
                        <div className="aspect-video relative">
                            <Image
                                src={previewData.thumbnail || previewData.gambar}
                                alt={previewData.judul_berita}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6">
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(previewData.tanggal_post).toLocaleDateString('id-ID')}
                            </div>
                            <div className="flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                {previewData.jenis_berita}
                            </div>
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                Admin
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold mb-4 text-foreground">
                            {previewData.judul_berita}
                        </h1>

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: previewData.isi }}
                        />

                        {/* Keywords */}
                        {previewData.keywords && (
                            <div className="mt-8 pt-6 border-t">
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                    Keywords:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {previewData.keywords.split(',').map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-muted text-xs rounded"
                                        >
                                            {keyword.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
}
