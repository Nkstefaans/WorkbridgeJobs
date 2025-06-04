import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "Salary not specified";
  if (min && max) return `R${(min / 1000).toFixed(0)}k - R${(max / 1000).toFixed(0)}k`;
  if (min) return `R${(min / 1000).toFixed(0)}k+`;
  if (max) return `Up to R${(max / 1000).toFixed(0)}k`;
  return "Salary not specified";
}

export function formatTimeAgo(date: Date | string | null): string {
  if (!date) return "Unknown";
  
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
