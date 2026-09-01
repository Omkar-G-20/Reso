import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// â”€â”€ Tailwind class merger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// â”€â”€ Currency formatter (INR) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function formatCurrency(amount: number): string {
  if (amount >= 10_000_000) {
    return `â‚¹${(amount / 10_000_000).toFixed(2)} Cr`;
  }
  if (amount >= 100_000) {
    return `â‚¹${(amount / 100_000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// â”€â”€ Date formatter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// â”€â”€ ID generator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// â”€â”€ Score color helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-gov-success";
  if (score >= 60) return "text-gov-warning";
  return "text-gov-danger";
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-gov-success-light text-gov-success";
  if (score >= 60) return "bg-gov-warning-light text-gov-warning";
  return "bg-gov-danger-light text-gov-danger";
}

// â”€â”€ Status badge helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function getStatusVariant(
  status: string
): "default" | "secondary" | "success" | "warning" | "danger" | "outline" {
  const map: Record<string, "default" | "secondary" | "success" | "warning" | "danger" | "outline"> = {
    draft: "secondary",
    published: "default",
    applications_open: "success",
    evaluation: "warning",
    sandbox: "default",
    procurement: "success",
    closed: "secondary",
    pending: "warning",
    in_progress: "default",
    completed: "success",
    payment_released: "success",
    verified: "success",
    rejected: "danger",
    submitted: "default",
    under_review: "warning",
    approved: "success",
    qualified: "success",
    active: "success",
    paused: "warning",
  };
  return map[status] ?? "outline";
}

// â”€â”€ Progress percentage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function calcProgress(achieved: number | null, target: number): number {
  if (achieved === null) return 0;
  return Math.min(Math.round((achieved / target) * 100), 100);
}

// â”€â”€ Anonymize startup name for blind evaluation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function anonymizeName(name: string, index: number): string {
  return `Applicant ${String.fromCharCode(65 + (index % 26))}-${String(index + 1).padStart(3, "0")}`;
}
