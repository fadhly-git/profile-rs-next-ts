"use client"

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, CalendarClock, AlertCircle, Lightbulb } from "lucide-react";
import { type KritikSaran } from '@/types';

interface StatsCardsProps {
    data: KritikSaran[];
}

export function StatsCards({ data }: StatsCardsProps) {
    const stats = React.useMemo(() => {
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        return {
            total: data.length,
            thisWeek: data.filter(item => new Date(item.createdAt) >= oneWeekAgo).length,
            thisMonth: data.filter(item => new Date(item.createdAt) >= oneMonthAgo).length,
            withCritik: data.filter(item => item.kritik && item.kritik.trim().length > 0).length,
            withSaran: data.filter(item => item.saran && item.saran.trim().length > 0).length,
        };
    }, [data]);

    const statsConfig = [
        {
            label: "Total",
            value: stats.total,
            icon: FileText,
            color: "border-l-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            iconColor: "text-blue-500"
        },
        {
            label: "Minggu Ini",
            value: stats.thisWeek,
            icon: Calendar,
            color: "border-l-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            iconColor: "text-green-500"
        },
        {
            label: "Bulan Ini",
            value: stats.thisMonth,
            icon: CalendarClock,
            color: "border-l-orange-500",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
            iconColor: "text-orange-500"
        },
        {
            label: "Ada Kritik",
            value: stats.withCritik,
            icon: AlertCircle,
            color: "border-l-red-500",
            bgColor: "bg-red-50",
            textColor: "text-red-600",
            iconColor: "text-red-500"
        },
        {
            label: "Ada Saran",
            value: stats.withSaran,
            icon: Lightbulb,
            color: "border-l-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
            iconColor: "text-purple-500"
        }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            {statsConfig.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                    <Card key={index} className={`${stat.color} ${stat.bgColor} border-l-4 hover:shadow-sm transition-shadow`}>
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                                        {stat.label}
                                    </p>
                                    <p className={`text-xl sm:text-2xl font-bold ${stat.textColor} truncate`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.iconColor}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}