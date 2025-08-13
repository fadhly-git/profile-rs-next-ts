import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// lib/utils.ts (tambahkan ke file utils yang sudah ada)
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function createExcerpt(content: string, maxLength: number = 100): string {
  // Remove HTML tags if any
  const cleanContent = content.replace(/<[^>]*>/g, '');

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Cut at word boundary
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  return lastSpaceIndex > 0
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
}

export function formatPeriod(period: string | null): string {
  if (!period) return '-'

  try {
    // Convert YYYY-MM to readable format
    const [year, month] = period.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
    return format(date, "MMMM yyyy", { locale: id })
  } catch {
    return period // Fallback to original value if parsing fails
  }
}

export function formatPeriodShort(period: string | null): string {
  if (!period) return '-'

  try {
    const [year, month] = period.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
    return format(date, "MMM yyyy", { locale: id })
  } catch {
    return period
  }
}

// Untuk badge/chip style
export function getPeriodBadgeInfo(period: string | null) {
  if (!period) return { text: '-', variant: 'secondary' as const }

  const currentDate = new Date()
  const currentPeriod = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`

  if (period === currentPeriod) {
    return { text: formatPeriodShort(period), variant: 'default' as const }
  } else if (period > currentPeriod) {
    return { text: formatPeriodShort(period), variant: 'outline' as const }
  } else {
    return { text: formatPeriodShort(period), variant: 'secondary' as const }
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tambahkan fungsi ini ke file utils.ts yang sudah ada
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function bigIntToString(value: bigint): string {
  return value.toString();
}

export function parseOptionalBigInt(value: FormDataEntryValue | null): bigint | null {
  if (!value || typeof value !== "string" || value === "" || value === "null") {
    return null;
  }

  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

export function formatDate(date: Date | string | null): string {
  if (!date) return '-'

  const d = new Date(date)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}