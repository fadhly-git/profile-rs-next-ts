"use client"

import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Breadcrumb } from '@/app/(public)/(menu)/hubungi-kami/page'

// Interface sesuai yang Anda berikan
export interface IndikatorMutu {
  id: number
  period: string | null
  judul: string | null
  capaian: string | null
  target: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

// Interface untuk response API
interface ApiResponse {
  success: boolean
  data: IndikatorMutu[]
}

// Props untuk komponen - bisa menerima array langsung atau response API
interface IndikatorMutuPageProps {
  data: IndikatorMutu[] | ApiResponse
}

export function IndikatorMutuPage({ data }: IndikatorMutuPageProps) {
  const [selectedYear, setSelectedYear] = React.useState<string>("all")

  // Normalisasi data - handle baik array langsung maupun response API
  const normalizedData: IndikatorMutu[] = React.useMemo(() => {
    if (Array.isArray(data)) {
      return data
    } else if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data.data
    }
    return []
  }, [data])

  // Fungsi untuk mendapatkan list tahun unik dari data
  const getAvailableYears = () => {
    const years = normalizedData
      .filter(item => item.period)
      .map(item => item.period!.split('-')[0])
      .filter((year, index, self) => self.indexOf(year) === index)
      .sort((a, b) => parseInt(b) - parseInt(a))

    return years
  }

  // Fungsi untuk memfilter data berdasarkan tahun
  const filterDataByYear = (data: IndikatorMutu[], year: string) => {
    if (year === "all") return data

    return data.filter(item =>
      item.period && item.period.startsWith(year)
    )
  }

  // Fungsi untuk mengelompokkan data berdasarkan judul indikator
  const groupDataByIndicator = (filteredData: IndikatorMutu[]) => {
    const grouped = filteredData.reduce((acc, item) => {
      if (!item.judul) return acc

      if (!acc[item.judul]) {
        acc[item.judul] = []
      }
      acc[item.judul].push(item)
      return acc
    }, {} as Record<string, IndikatorMutu[]>)

    // Sort setiap grup berdasarkan period
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        if (!a.period || !b.period) return 0
        return a.period.localeCompare(b.period)
      })
    })

    return grouped
  }

  // Fungsi untuk mengformat data untuk chart
  const formatChartData = (indicatorData: IndikatorMutu[]) => {
    return indicatorData.map(item => ({
      period: item.period,
      month: item.period ? formatPeriodToMonth(item.period) : '',
      capaian: parseFloat(item.capaian || '0'),
      target: parseFloat(item.target || '0')
    }))
  }

  // Fungsi untuk format periode ke nama bulan
  const formatPeriodToMonth = (period: string) => {
    const [year, month] = period.split('-')
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }
  const breadcrumbItems = [
    { label: 'Indikator Mutu', href: '/indikator-mutu' },
  ]

  const availableYears = getAvailableYears()
  const filteredData = filterDataByYear(normalizedData, selectedYear)
  const groupedData = groupDataByIndicator(filteredData)

  // Konfigurasi chart
  const chartConfig: ChartConfig = {
    capaian: {
      label: "Capaian",
      color: "#07b8b2",
    },
    target: {
      label: "Target",
      color: "#e11d48",
    },
  }

  // Loading state jika data kosong
  if (normalizedData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Tidak ada data indikator mutu</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />
      {/* Header dengan filter tahun */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold">Indikator Mutu</h1>
        </div>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tahun</SelectItem>
            {availableYears.map(year => (
              <SelectItem key={year} value={year}>
                Tahun {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid cards untuk setiap indikator */}
      <div className="grid gap-6">
        {Object.entries(groupedData).map(([indicatorName, indicatorData]) => {
          const chartData = formatChartData(indicatorData)
          const latestData = indicatorData[indicatorData.length - 1]

          return (
            <Card key={indicatorName} className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">{indicatorName}</CardTitle>
                <CardDescription>
                  Target: {latestData?.target}% |
                  Periode terpilih: {selectedYear === "all" ? "Semua tahun" : `Tahun ${selectedYear}`}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[350px] w-full"
                >
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => `Periode: ${value}`}
                          indicator="line"
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                      dataKey="target"
                      type="monotone"
                      stroke="var(--color-target)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{
                        fill: "var(--color-target)",
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />
                    <Line
                      dataKey="capaian"
                      type="monotone"
                      stroke="var(--color-capaian)"
                      strokeWidth={2}
                      dot={{
                        fill: "var(--color-capaian)",
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}