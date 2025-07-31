"use client"

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Database, Table, Eye } from "lucide-react";
import { type KritikSaran } from '@/types';
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

interface ExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedData: KritikSaran[];
    allData: KritikSaran[];
    onExport: (format: 'csv' | 'json' | 'excel') => void;
}

export function ExportDialog({
    open,
    onOpenChange,
    selectedData,
    allData,
    onExport
}: ExportDialogProps) {
    const isMobile = useIsMobile();
    const [showPreview, setShowPreview] = React.useState(false);
    const [selectedFormat, setSelectedFormat] = React.useState<'csv' | 'json' | 'excel' | null>(null);

    const dataToExport = selectedData.length > 0 ? selectedData : allData;
    const isSelectedData = selectedData.length > 0;

    const handleExport = (format: 'csv' | 'json' | 'excel') => {
        onExport(format);
        onOpenChange(false);
        setSelectedFormat(null);
        setShowPreview(false);
    };

    const formatOptions = [
        {
            key: 'csv' as const,
            title: 'CSV (Comma Separated Values)',
            description: 'Format tabel yang dapat dibuka di Excel atau Google Sheets',
            icon: Table,
            color: 'text-green-600',
            extension: '.csv'
        },
        {
            key: 'excel' as const,
            title: 'Excel (.xlsx)',
            description: 'Format Excel dengan formatting yang lebih baik',
            icon: FileText,
            color: 'text-blue-600',
            extension: '.xlsx'
        },
        {
            key: 'json' as const,
            title: 'JSON (JavaScript Object Notation)',
            description: 'Format data untuk penggunaan programming',
            icon: Database,
            color: 'text-orange-600',
            extension: '.json'
        }
    ];

    const DialogContent_Component = ({ children }: { children: React.ReactNode }) => {
        if (isMobile) {
            return (
                <Drawer open={open} onOpenChange={onOpenChange}>
                    <DrawerContent className="max-h-[90vh]">
                        <DrawerHeader className="px-4 py-3">
                            <DrawerTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Export Data
                            </DrawerTitle>
                            <DrawerDescription className="text-sm">
                                {dataToExport.length} data akan diekspor
                            </DrawerDescription>
                        </DrawerHeader>
                        {children}
                    </DrawerContent>
                </Drawer>
            );
        }
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            Export Data Kritik & Saran
                        </DialogTitle>
                        <DialogDescription>
                            Pilih format file untuk mengekspor {dataToExport.length} data kritik dan saran
                        </DialogDescription>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        );
    }

    const PreviewModal = () => (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="!max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Preview Data Export
                    </DialogTitle>
                    <DialogDescription>
                        Menampilkan {dataToExport.length} data yang akan diekspor
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-96 border rounded-md">
                    <div className="p-4 space-y-3">
                        {dataToExport.slice(0, 5).map((item) => (
                            <Card key={item.id} className="border-l-4 border-l-blue-500">
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="font-semibold">Nama:</span>
                                            <p className="text-muted-foreground">{item.nama}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Email:</span>
                                            <p className="text-muted-foreground">{item.email || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Layanan:</span>
                                            <p className="text-muted-foreground">{item.perawatan_terakait}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Tanggal:</span>
                                            <p className="text-muted-foreground">
                                                {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                    {(item.kritik || item.saran) && (
                                        <>
                                            <Separator className="my-2" />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {item.kritik && (
                                                    <div>
                                                        <span className="font-semibold text-red-600">Kritik:</span>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {item.kritik}
                                                        </p>
                                                    </div>
                                                )}
                                                {item.saran && (
                                                    <div>
                                                        <span className="font-semibold text-green-600">Saran:</span>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {item.saran}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ))}

                        {dataToExport.length > 5 && (
                            <Card className="border-dashed">
                                <CardContent className="p-4 text-center text-muted-foreground">
                                    <p>Dan {dataToExport.length - 5} data lainnya...</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowPreview(false)}>
                        Tutup Preview
                    </Button>
                    {selectedFormat && (
                        <Button onClick={() => handleExport(selectedFormat)}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Sekarang
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return (
        <>
            <DialogContent_Component>
                <div className="px-4 pb-4 space-y-4">
                    {/* Info Data Selection */}
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium block">
                                {isSelectedData ? 'Data yang dipilih' : 'Total data'}
                            </span>
                            <p className="text-xs text-muted-foreground">
                                {isSelectedData ? 'Export data yang diseleksi' : 'Export semua data'}
                            </p>
                        </div>
                        <Badge variant={isSelectedData ? "default" : "secondary"} className="flex-shrink-0">
                            {dataToExport.length}
                        </Badge>
                    </div>

                    {/* Format Options */}
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Pilih Format:</h4>
                        {/* Preview Button */}
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowPreview(true)}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview Data
                        </Button>
                        <div className="grid gap-2">
                            {formatOptions.map((option) => {
                                const IconComponent = option.icon;
                                return (
                                    <Card
                                        key={option.key}
                                        className="cursor-pointer hover:bg-accent transition-colors border-2 hover:border-primary/20"
                                        onClick={() => handleExport(option.key)}
                                    >
                                        <CardContent className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg bg-accent`}>
                                                    <IconComponent className={`h-4 w-4 ${option.color}`} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-sm">{option.title}</p>
                                                    <p className="text-xs text-muted-foreground">{option.description}</p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <Badge variant="outline" className="text-xs">
                                                        {option.extension}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Export Buttons for Mobile */}
                    {isMobile && (
                        <div className="pt-3 border-t">
                            <div className="grid grid-cols-3 gap-2">
                                {formatOptions.map((option) => (
                                    <Button
                                        key={option.key}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport(option.key)}
                                        className="text-xs h-8"
                                    >
                                        {option.title}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!isMobile && (
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="w-full sm:w-auto"
                            >
                                Batal
                            </Button>
                        </DialogFooter>
                    )}

                    {isMobile && (
                        <DrawerFooter className="px-0 pt-3 border-t">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="w-full"
                            >
                                Batal
                            </Button>
                        </DrawerFooter>
                    )}
                </div>
            </DialogContent_Component>
            <PreviewModal />
        </>
    );
}