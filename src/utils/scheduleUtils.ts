// utils/scheduleUtils.ts
import type { JadwalDokters, GroupedSchedule } from '@/types/jadwal-public';

const DAYS_ORDER = [
    'Senin',
    'Selasa', 
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu'
];

export function groupSchedulesByTime(jadwals: JadwalDokters[]): GroupedSchedule[] {
    // Group berdasarkan kombinasi jam_mulai, jam_selesai, dan status
    const timeGroups = new Map<string, {
        hari: string[];
        jam_mulai: string;
        jam_selesai: string;
        status: number;
    }>();

    jadwals.forEach(jadwal => {
        const jamMulai = formatTime(jadwal.jam_mulai);
        const jamSelesai = formatTime(jadwal.jam_selesai);
        const key = `${jamMulai}-${jamSelesai}-${jadwal.status}`;

        if (!timeGroups.has(key)) {
            timeGroups.set(key, {
                hari: [],
                jam_mulai: jamMulai,
                jam_selesai: jamSelesai,
                status: jadwal.status
            });
        }

        timeGroups.get(key)?.hari.push(jadwal.hari);
    });

    // Convert ke format yang dibutuhkan
    return Array.from(timeGroups.values()).map(group => ({
        hari: formatHari(group.hari),
        jam_mulai: group.jam_mulai,
        jam_selesai: group.jam_selesai,
        status: group.status
    }));
}

function formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
}

export function formatHari(hari: string[]): string {
    // Sort hari berdasarkan urutan
    const sorted = hari
        .map(day => ({
            name: day,
            index: DAYS_ORDER.indexOf(day)
        }))
        .filter(item => item.index !== -1) // Filter hari yang tidak valid
        .sort((a, b) => a.index - b.index);

    if (sorted.length === 0) return '-';
    if (sorted.length === 1) return sorted[0].name;

    // Group consecutive days
    const groups: string[][] = [];
    let currentGroup = [sorted[0].name];

    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].index === sorted[i - 1].index + 1) {
            currentGroup.push(sorted[i].name);
        } else {
            groups.push(currentGroup);
            currentGroup = [sorted[i].name];
        }
    }
    groups.push(currentGroup);

    // Format groups
    return groups
        .map(group => {
            if (group.length === 1) return group[0];
            if (group.length === 2) return `${group[0]} & ${group[group.length - 1]}`;
            return `${group[0]} - ${group[group.length - 1]}`;
        })
        .join(', ');
}