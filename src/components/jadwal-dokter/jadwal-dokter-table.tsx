// components/jadwal-dokter-table.tsx
"use client"
// components/jadwal-dokter/jadwal-dokter-table.tsx
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Calendar, User, Stethoscope } from 'lucide-react';
import type {
  PrismaDokters,
  SpesialisGroup,
  DokterWithSchedules,
  GroupedSchedule
} from '@/types/jadwal-public';
import { Avatar, AvatarImage } from '../ui/avatar';

interface JadwalDokterTableProps {
  data: PrismaDokters;
}

export const JadwalDokterTable: React.FC<JadwalDokterTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Transform data menjadi format yang dibutuhkan
  const transformedData = useMemo((): SpesialisGroup[] => {
    const spesialisMap = new Map<string, DokterWithSchedules[]>();

    data.forEach(dokter => {
      const scheduleGroups = groupSchedulesByTime(dokter.JadwalDokters);

      const dokterWithSchedules: DokterWithSchedules = {
        id_dokter: dokter.id_dokter,
        nama_dokter: dokter.nama_dokter,
        photo: dokter.photo,
        schedules: scheduleGroups
      };

      dokter.dokter_spesialis.forEach(ds => {
        const spesialisName = ds.spesialis.nama_spesialis;

        if (!spesialisMap.has(spesialisName)) {
          spesialisMap.set(spesialisName, []);
        }

        spesialisMap.get(spesialisName)?.push(dokterWithSchedules);
      });
    });

    return Array.from(spesialisMap.entries())
      .map(([nama_spesialis, dokters]) => ({
        nama_spesialis,
        dokters: dokters.sort((a, b) =>
          a.nama_dokter.localeCompare(b.nama_dokter)
        )
      }))
      .sort((a, b) => a.nama_spesialis.localeCompare(b.nama_spesialis));
  }, [data]);

  const filteredData = useMemo((): SpesialisGroup[] => {
    if (!searchTerm.trim()) return transformedData;

    const filtered = transformedData.map(spesialis => ({
      ...spesialis,
      dokters: spesialis.dokters.filter(dokter =>
        dokter.nama_dokter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spesialis.nama_spesialis.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(spesialis => spesialis.dokters.length > 0);

    return filtered;
  }, [transformedData, searchTerm]);

  const totalDokters = transformedData.reduce((total, s) => total + s.dokters.length, 0);
  const filteredDokters = filteredData.reduce((total, s) => total + s.dokters.length, 0);

  return (
    <div className="w-full space-y-6">
      {/* Header dan Search */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Jadwal Praktik Dokter Spesialis
          </h2>
          <p className="text-gray-600">
            Total {totalDokters} dokter tersedia dalam {transformedData.length} spesialisasi
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Cari dokter atau spesialis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="text-sm text-gray-600">
            {filteredDokters > 0 ? (
              <span>
                Menampilkan {filteredDokters} dokter dari {totalDokters} total dokter
              </span>
            ) : (
              <span className="text-red-600">
                Tidak ditemukan dokter dengan kata kunci &quot;{searchTerm}&quot;
              </span>
            )}
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden">
        {filteredData.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Tidak ada dokter yang ditemukan' : 'Tidak ada data jadwal dokter'}
              </h3>
              {searchTerm && (
                <p className="text-gray-600 text-center">
                  Coba ubah kata kunci pencarian Anda
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredData.map((spesialis) => (
              <Card key={spesialis.nama_spesialis} className="overflow-hidden">
                <CardHeader className="items-center py-1 bg-gradient-to-r from-[#07b8b2] to-[#06a0a0] text-white">
                  <CardTitle className="flex items-center space-x-2 text-sm font-semibold">
                    <Stethoscope className="w-5 h-5" />
                    <span>Spesialis {spesialis.nama_spesialis}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {spesialis.dokters.map((dokter, dokterIndex) => (
                    <div
                      key={dokter.id_dokter.toString()}
                      className={`border-b last:border-b-0 ${dokterIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      {/* Nama Dokter */}
                      <div className="p-4 border-b border-gray-200 bg-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#07b8b2] flex items-center justify-center">
                            <Avatar className="h-8 w-8">
                              {dokter.photo ? (
                                <AvatarImage src={dokter.photo} alt={dokter.nama_dokter} />
                              ) : (
                                <User className="w-6 h-6 text-white" />
                              )}
                            </Avatar>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {dokter.nama_dokter}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {dokter.schedules.filter(s => s.status === 1).length} jadwal aktif
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Jadwal List */}
                      <div className="space-y-0">
                        {dokter.schedules.map((schedule, idx) => (
                          <div
                            key={idx}
                            className="p-4 border-b last:border-b-0 border-gray-100"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="font-medium text-gray-900">
                                  {schedule.hari}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {schedule.status === 1 ? (
                                  <>
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                                      {schedule.jam_mulai} - {schedule.jam_selesai}
                                    </Badge>
                                  </>
                                ) : (
                                  <Badge variant="destructive">
                                    Cuti
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <Card className="overflow-hidden">
          <Table>
            <TableCaption className="py-4 text-base">
              {searchTerm && filteredData.length > 0 && (
                <span>
                  Menampilkan {filteredDokters} dokter dari {totalDokters} total dokter
                </span>
              )}
              {searchTerm && filteredData.length === 0 && (
                <span className="text-gray-500">
                  Tidak ditemukan dokter dengan kata kunci &quot;{searchTerm}&quot;
                </span>
              )}
              {!searchTerm && (
                <span>
                  Jadwal dapat berubah sewaktu-waktu. Harap konfirmasi sebelum berkunjung.
                </span>
              )}
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-base">
                <TableHead className="font-bold text-gray-900 w-1/3 py-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Dokter</span>
                  </div>
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-center w-1/3 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Hari</span>
                  </div>
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-center w-1/3 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Waktu Layanan</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-16">
                    <div className="flex flex-col items-center space-y-4">
                      <Search className="w-16 h-16 text-gray-300" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {searchTerm ? 'Tidak ada dokter yang ditemukan' : 'Tidak ada data jadwal dokter'}
                        </h3>
                        {searchTerm && (
                          <p className="text-gray-600">
                            Coba ubah kata kunci pencarian Anda
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((spesialis) => (
                  <React.Fragment key={spesialis.nama_spesialis}>
                    {/* Header Spesialis */}
                    <TableRow className="bg-gradient-to-r from-[#07b8b2] to-[#06a0a0] hover:from-[#06a0a0] hover:to-[#058b8b]">
                      <TableCell colSpan={3} className="font-bold text-white py-4">
                        <div className="flex items-center space-x-3 text-base">
                          <Stethoscope className="w-6 h-6" />
                          <span>Spesialis {spesialis.nama_spesialis}</span>
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {spesialis.dokters.length} dokter
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Dokter dan Jadwal */}
                    {spesialis.dokters.map((dokter, dokterIndex) => {
                      let isFirstRow = true;

                      return dokter.schedules.map((schedule, scheduleIndex) => {
                        const showName = isFirstRow;
                        isFirstRow = false;

                        const isEvenDoctor = dokterIndex % 2 === 0;
                        const rowBgClass = isEvenDoctor ? 'hover:bg-blue-50' : 'hover:bg-gray-50';

                        if (schedule.status === 0) {
                          // Tampilkan jadwal cuti
                          return (
                            <TableRow
                              key={`${dokter.id_dokter.toString()}-${scheduleIndex}`}
                              className={`bg-red-50 border-l-4 border-l-red-400 hover:bg-red-100 transition-colors ${rowBgClass}`}
                            >
                              <TableCell className="py-4">
                                {showName ? (
                                  <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center">
                                      <Avatar className="h-8 w-8">
                                        {dokter.photo ? (
                                          <AvatarImage src={dokter.photo} alt={dokter.nama_dokter} />
                                        ) : (
                                          <User className="w-6 h-6 text-red-600" />
                                        )}
                                      </Avatar>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900 text-base">
                                        {dokter.nama_dokter}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {dokter.schedules.filter(s => s.status === 1).length} jadwal aktif
                                      </p>
                                    </div>
                                  </div>
                                ) : null}
                              </TableCell>
                              <TableCell className="text-center py-4">
                                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 text-base px-2">
                                  {schedule.hari}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center py-4">
                                <Badge variant="destructive" className="text-base px-2">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Cuti
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        }

                        // Tampilkan jadwal aktif
                        return (
                          <TableRow
                            key={`${dokter.id_dokter.toString()}-${scheduleIndex}`}
                            className={`border-l-4 border-l-green-400 transition-colors ${rowBgClass}`}
                          >
                            <TableCell className="py-4">
                              {showName ? (
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#07b8b2] to-[#06a0a0] flex items-center justify-center shadow-md">
                                    <Avatar className="h-8 w-8">
                                      {dokter.photo ? (
                                        <AvatarImage src={dokter.photo} alt={dokter.nama_dokter} />
                                      ) : (
                                        <User className="w-6 h-6 text-red-600" />
                                      )}
                                    </Avatar>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 text-lg">
                                      {dokter.nama_dokter}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {dokter.schedules.filter(s => s.status === 1).length} jadwal aktif
                                    </p>
                                  </div>
                                </div>
                              ) : null}
                            </TableCell>
                            <TableCell className="text-center py-4">
                              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300 text-base px-2">
                                {schedule.hari}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center py-4">
                              <Badge className="bg-green-600 hover:bg-green-700 text-white text-base px-2">
                                <Clock className="w-4 h-4 mr-2" />
                                {schedule.jam_mulai} - {schedule.jam_selesai}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      });
                    })}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

// Utility functions (sama seperti sebelumnya)
function groupSchedulesByTime(jadwals: {
  id_jadwal: bigint;
  id_dokter: bigint;
  hari: string;
  jam_mulai: Date;
  jam_selesai: Date;
  status: number;
}[]): GroupedSchedule[] {

  const timeGroups = new Map<string, {
    hari: string[];
    jam_mulai: string;
    jam_selesai: string;
    status: number;
  }>();

  jadwals.forEach(jadwal => {
    const jamMulai = jadwal.jam_mulai.toTimeString().slice(0, 5);
    const jamSelesai = jadwal.jam_selesai.toTimeString().slice(0, 5);
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

  return Array.from(timeGroups.values())
    .map(group => ({
      hari: formatHari(group.hari),
      jam_mulai: group.jam_mulai,
      jam_selesai: group.jam_selesai,
      status: group.status
    }))
    .sort((a, b) => {
      if (a.status !== b.status) {
        return b.status - a.status;
      }
      return a.jam_mulai.localeCompare(b.jam_mulai);
    });
}

function formatHari(hari: string[]): string {
  const DAYS_ORDER = [
    'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'
  ];

  const sorted = hari
    .map(day => ({
      name: day,
      index: DAYS_ORDER.indexOf(day)
    }))
    .filter(item => item.index !== -1)
    .sort((a, b) => a.index - b.index);

  if (sorted.length === 0) return '-';
  if (sorted.length === 1) return sorted[0].name;

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

  return groups
    .map(group => {
      if (group.length === 1) return group[0];
      if (group.length === 2) return `${group[0]} & ${group[group.length - 1]}`;
      return `${group[0]} - ${group[group.length - 1]}`;
    })
    .join(', ');
}