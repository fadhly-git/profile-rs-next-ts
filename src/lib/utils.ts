import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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