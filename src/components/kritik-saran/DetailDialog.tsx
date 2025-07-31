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
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from "@/components/ui/drawer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    MessageCircle,
    User,
    Building,
    Mail,
    Phone,
    CalendarClock,
    AlertCircle,
    Lightbulb,
    Copy,
    CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { type KritikSaran } from '@/types';

interface DetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedDetail: KritikSaran | null;
}

export function DetailDialog({ open, onOpenChange, selectedDetail }: DetailDialogProps) {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    if (!selectedDetail) return null;

    const DialogContent_Component = ({ children }: { children: React.ReactNode }) => {
        if (isMobile) {
            return (
                <Drawer open={open} onOpenChange={onOpenChange}>
                    <DrawerContent className="max-h-[95vh] pb-2">
                        <DrawerHeader className="px-4 py-3 border-b">
                            <DrawerTitle className="flex items-center gap-2 text-lg font-bold">
                                <div className="p-2 bg-accent rounded-lg">
                                    <MessageCircle className="h-5 w-5 text-blue-600" />
                                </div>
                                Detail Kritik & Saran
                            </DrawerTitle>
                            <DrawerDescription className="text-sm">
                                Masukan dari <strong>{selectedDetail.nama}</strong> • {new Date(selectedDetail.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </DrawerDescription>
                        </DrawerHeader>
                        {children}
                        <DrawerFooter className="px-4 py-3 border-t">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>ID: {selectedDetail.id}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                JSON.stringify(selectedDetail, (_key, value) =>
                                                    typeof value === 'bigint' ? value.toString() : value, 2
                                                )
                                            );
                                            toast.success("Data disalin ke clipboard");
                                        }}
                                        className="flex-1"
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Salin Data
                                    </Button>
                                    <Button
                                        onClick={() => onOpenChange(false)}
                                        className="flex-1"
                                    >
                                        Tutup
                                    </Button>
                                </div>
                            </div>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            );
        }

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="!max-w-6xl w-[95%] min-h-0 p-0">
                    <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r">
                        <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                            <div className="p-2 bg-accent rounded-lg">
                                <MessageCircle className="h-6 w-6 text-blue-600" />
                            </div>
                            Detail Kritik & Saran
                        </DialogTitle>
                        <DialogDescription className="mt-2">
                            Masukan dari <strong>{selectedDetail.nama}</strong> • {new Date(selectedDetail.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </DialogDescription>
                    </DialogHeader>
                    {children}
                    <DialogFooter className="px-6 py-4 border-t">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>ID: {selectedDetail.id}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            JSON.stringify(selectedDetail, (key, value) =>
                                                typeof value === 'bigint' ? value.toString() : value, 2
                                            )
                                        );
                                        toast.success("Data disalin ke clipboard");
                                    }}
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Salin Data
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <DialogContent_Component>
            <ScrollArea className={isMobile ? "h-[60vh] px-4 py-2" : "h-[calc(90vh-12rem)] px-6 py-4"}>
                <div className="space-y-4">
                    {/* Contact & Service Info */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Contact Information */}
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                    Informasi Kontak
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Nama Lengkap
                                        </Label>
                                        <p className="font-semibold text-sm sm:text-base">{selectedDetail.nama}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Email
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                            <p className="font-mono text-sm break-all">{selectedDetail.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Telepon
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                            <p className="font-mono text-sm">{selectedDetail.telepon || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Alamat
                                        </Label>
                                        <div className="flex items-start gap-2">
                                            <Building className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                                            <p className="text-sm leading-relaxed">{selectedDetail.alamat || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Service Information */}
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Building className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                    Informasi Layanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Jenis Perawatan
                                        </Label>
                                        <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                                            {selectedDetail.perawatan_terakait}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Unit/Poli
                                        </Label>
                                        <Badge variant="outline" className="border-gray-300 text-xs">
                                            {selectedDetail.nama_poli}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Ruang/Kamar
                                        </Label>
                                        {selectedDetail.nama_kmr_no_kmr ? (
                                            <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                                                {selectedDetail.nama_kmr_no_kmr}
                                            </Badge>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Tidak disebutkan</span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Waktu Pengiriman
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <CalendarClock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                            <span className="text-sm">
                                                {new Date(selectedDetail.createdAt).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Feedback Content - Stack vertically on mobile */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Kritik */}
                        <Card className="border-l-4 border-l-red-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-red-800">
                                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Kritik & Keluhan
                                </CardTitle>
                                <CardDescription className="text-red-600 text-sm">
                                    Masukan negatif yang perlu ditindaklanjuti
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="border border-red-200 bg-red-50 rounded-lg p-3 sm:p-4">
                                    <p className="text-sm text-red-800 whitespace-pre-line leading-relaxed">
                                        {selectedDetail.kritik || (
                                            <span className="text-red-500 italic">
                                                Tidak ada kritik yang disampaikan
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Saran */}
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-green-800">
                                    <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Saran & Masukan
                                </CardTitle>
                                <CardDescription className="text-green-600 text-sm">
                                    Usulan perbaikan untuk layanan yang lebih baik
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="border border-green-200 bg-green-50 rounded-lg p-3 sm:p-4">
                                    <p className="text-sm text-green-800 whitespace-pre-line leading-relaxed">
                                        {selectedDetail.saran || (
                                            <span className="text-green-500 italic">
                                                Tidak ada saran yang disampaikan
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>
        </DialogContent_Component>
    );
}