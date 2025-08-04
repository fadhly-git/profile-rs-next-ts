// components/doctor-schedule-section.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dokter, ProcessedDoctor, ProcessedSchedule } from '@/types/public';
import { isValidImageUrl } from '@/lib/validators';

interface DoctorScheduleSectionProps {
  doctorsWithSchedule: Dokter[];
}

// Fungsi utility yang dipindahkan ke atas
const groupConsecutiveDays = (days: string[]): string[] => {
  const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const sortedDays = days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
  
  if (sortedDays.length <= 1) return sortedDays;
  
  const groups: string[][] = [];
  let currentGroup = [sortedDays[0]];
  
  for (let i = 1; i < sortedDays.length; i++) {
    const currentIndex = dayOrder.indexOf(sortedDays[i]);
    const prevIndex = dayOrder.indexOf(sortedDays[i - 1]);
    
    if (currentIndex === prevIndex + 1) {
      currentGroup.push(sortedDays[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [sortedDays[i]];
    }
  }
  groups.push(currentGroup);
  
  return groups.map(group => 
    group.length > 1 ? `${group[0]} - ${group[group.length - 1]}` : group[0]
  );
};

// Fungsi untuk format waktu dari Date ke string
const formatTimeFromDate = (dateTime: Date): string => {
  return dateTime.toTimeString().substring(0, 5); // HH:MM
};

export default function DoctorScheduleSection({ doctorsWithSchedule }: DoctorScheduleSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3; // Desktop: 3 cards, akan responsive

  // Group schedules by doctor and time
  const processedDoctors: ProcessedDoctor[] = doctorsWithSchedule?.map(doctor => {
    const scheduleGroups: Record<string, {
      jam_mulai: string;
      jam_selesai: string;
      days: Array<{ hari: string; status: number }>;
      hasInactive: boolean;
    }> = {};
    
    doctor.JadwalDokters.forEach(schedule => {
      const jamMulai = formatTimeFromDate(new Date(schedule.jam_mulai));
      const jamSelesai = formatTimeFromDate(new Date(schedule.jam_selesai));
      const timeKey = `${jamMulai}-${jamSelesai}`;
      
      if (!scheduleGroups[timeKey]) {
        scheduleGroups[timeKey] = {
          jam_mulai: jamMulai,
          jam_selesai: jamSelesai,
          days: [],
          hasInactive: false
        };
      }
      
      scheduleGroups[timeKey].days.push({
        hari: schedule.hari,
        status: schedule.status
      });
      
      if (schedule.status === 0) {
        scheduleGroups[timeKey].hasInactive = true;
      }
    });

    // Convert to array and group consecutive days
    const schedules: ProcessedSchedule[] = Object.values(scheduleGroups).map(group => {
      const activeDays = group.days.filter(day => day.status === 1);
      const inactiveDays = group.days.filter(day => day.status === 0);
      
      return {
        jam_mulai: group.jam_mulai,
        jam_selesai: group.jam_selesai,
        activeDays: groupConsecutiveDays(activeDays.map(d => d.hari)),
        inactiveDays: inactiveDays.map(d => d.hari)
      };
    });

    return {
      ...doctor,
      processedSchedules: schedules
    };
  }) || [];

  const totalSlides = Math.ceil(processedDoctors.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (totalSlides <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  if (!processedDoctors.length) return null;

  return (
    <section className="py-16 lg:py-24 bg-white max-w-7xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Jadwal Dokter
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Jadwal praktik dokter spesialis dan umum di rumah sakit kami
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {processedDoctors
                    .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                    .map((doctor) => (
                      <Card
                        key={doctor.id_dokter.toString()}
                        className="hover:shadow-lg transition-all duration-300"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                              {doctor.photo && isValidImageUrl(doctor.photo) ? (
                                <Image
                                  src={doctor.photo}
                                  alt={doctor.nama_dokter}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#07b8b2]/10 flex items-center justify-center text-[#07b8b2] font-semibold text-lg">
                                  {doctor.nama_dokter.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {doctor.nama_dokter}
                              </h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {doctor.dokter_spesialis?.map((spec, idx) => (
                                  <Badge
                                    key={`${spec.id_dokter.toString()}-${spec.id_spesialis.toString()}-${idx}`}
                                    variant="secondary"
                                    className="text-xs bg-[#07b8b2]/10 text-[#07b8b2] hover:bg-[#07b8b2]/20"
                                  >
                                    {spec.spesialis.nama_spesialis}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {doctor.processedSchedules.map((schedule, idx) => (
                              <div
                                key={idx}
                                className="border-l-4 border-[#07b8b2] pl-4 py-2"
                              >
                                <div className="flex items-center space-x-2 mb-1">
                                  <Clock className="w-4 h-4 text-[#07b8b2]" />
                                  <span className="font-medium text-gray-900">
                                    {schedule.jam_mulai} - {schedule.jam_selesai}
                                  </span>
                                </div>
                                
                                {schedule.activeDays.length > 0 && (
                                  <div className="flex items-start space-x-2 mb-1">
                                    <Calendar className="w-4 h-4 text-gray-600 mt-0.5" />
                                    <div className="flex flex-wrap gap-1">
                                      {schedule.activeDays.map((dayGroup, dayIdx) => (
                                        <Badge
                                          key={dayIdx}
                                          variant="outline"
                                          className="text-xs border-[#07b8b2] text-[#07b8b2]"
                                        >
                                          {dayGroup}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {schedule.inactiveDays.length > 0 && (
                                  <div className="flex items-start space-x-2">
                                    <Calendar className="w-4 h-4 text-red-500 mt-0.5" />
                                    <div className="flex flex-wrap gap-1">
                                      {schedule.inactiveDays.map((day, dayIdx) => (
                                        <Badge
                                          key={dayIdx}
                                          variant="outline"
                                          className="text-xs border-red-500 text-red-500"
                                        >
                                          {day} (Libur)
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#07b8b2] p-3 rounded-full transition-all duration-200 border"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#07b8b2] p-3 rounded-full transition-all duration-200 border"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-[#07b8b2] w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}