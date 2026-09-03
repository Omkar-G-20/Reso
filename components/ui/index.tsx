import { cn } from "@/lib/utils";
import * as React from "react";

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none";

    const variants = {
      primary:
        "bg-gov-gradient text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200 focus:ring-gov-blue active:translate-y-0",
      success:
        "bg-gradient-to-r from-emerald-600 to-gov-success text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-200 focus:ring-gov-success active:translate-y-0",
      warning:
        "bg-gradient-to-r from-amber-500 to-gov-warning text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-200 focus:ring-gov-warning active:translate-y-0",
      danger:
        "bg-gradient-to-r from-red-500 to-red-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-200 focus:ring-red-500 active:translate-y-0",
      outline:
        "border-2 border-gov-blue text-gov-blue bg-white hover:bg-blue-50 hover:-translate-y-0.5 focus:ring-gov-blue active:translate-y-0",
      ghost: "text-gov-blue bg-transparent hover:bg-blue-50 focus:ring-gov-blue",
      secondary: "bg-gray-100 text-gov-text hover:bg-gray-200 focus:ring-gray-300",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2.5",
      lg: "text-base px-6 py-3",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// Badge
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "secondary" | "outline" | "blue";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const variants = {
    default: "bg-gov-blue-pale text-gov-blue",
    success: "bg-gov-success-light text-gov-success",
    warning: "bg-gov-warning-light text-gov-warning",
    danger: "bg-gov-danger-light text-gov-danger",
    secondary: "bg-gray-100 text-gov-muted",
    outline: "border border-gov-border text-gov-muted",
    blue: "bg-blue-600 text-white",
  };
  const sizes = {
    sm: "text-xs px-2.5 py-0.5",
    md: "text-sm px-3 py-1",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full font-semibold", variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

// Card
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  id?: string;
}

export function Card({ children, className, hover = false, onClick, id }: CardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-gov-border shadow-gov",
        (hover || onClick) && "hover:shadow-gov-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4 border-b border-gov-border", className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4 border-t border-gov-border bg-gray-50 rounded-b-xl", className)}>{children}</div>;
}

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-gov-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "gov-input",
            error && "border-gov-danger focus:border-gov-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-gov-muted">{hint}</p>}
        {error && <p className="text-xs text-gov-danger font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-gov-text">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "gov-input resize-y min-h-[100px]",
            error && "border-gov-danger",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-gov-muted">{hint}</p>}
        {error && <p className="text-xs text-gov-danger font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-gov-text">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn("gov-input appearance-none bg-white", error && "border-gov-danger", className)}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-gov-danger font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

// Progress Bar
export function ProgressBar({
  value,
  max = 100,
  color = "blue",
  label,
  showPercent = true,
}: {
  value: number;
  max?: number;
  color?: "blue" | "green" | "amber" | "red";
  label?: string;
  showPercent?: boolean;
}) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const colorMap = {
    blue: "from-gov-navy to-gov-blue",
    green: "from-emerald-600 to-gov-success",
    amber: "from-amber-600 to-gov-warning",
    red: "from-red-500 to-red-600",
  };
  return (
    <div className="space-y-1">
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs text-gov-muted">{label}</span>}
          {showPercent && <span className="text-xs font-semibold text-gov-text">{pct}%</span>}
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full bg-gradient-to-r rounded-full transition-all duration-700 ease-out", colorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// Stat Card
export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "blue",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: "blue" | "green" | "amber" | "purple";
}) {
  const colorMap = {
    blue: { bg: "bg-blue-50", icon: "text-gov-blue", text: "text-gov-navy" },
    green: { bg: "bg-emerald-50", icon: "text-gov-success", text: "text-emerald-700" },
    amber: { bg: "bg-amber-50", icon: "text-gov-warning", text: "text-amber-700" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", text: "text-purple-700" },
  };
  const c = colorMap[color];
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gov-muted uppercase tracking-wider mb-1">{label}</p>
          <p className={cn("font-heading font-bold text-2xl", c.text)}>{value}</p>
          {trend && (
            <p className={cn("text-xs mt-1", trend.value >= 0 ? "text-gov-success" : "text-gov-danger")}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", c.bg)}>
          <span className={c.icon}>{icon}</span>
        </div>
      </div>
    </Card>
  );
}

// Section Title
export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="font-heading font-bold text-xl text-gov-navy">{title}</h2>
        {subtitle && <p className="text-sm text-gov-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// Alert
export function Alert({
  children,
  variant = "info",
  icon,
  className,
}: {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "danger";
  icon?: React.ReactNode;
  className?: string;
}) {
  const variants = {
    info: "bg-blue-50 border-gov-blue text-gov-blue",
    success: "bg-gov-success-light border-gov-success text-emerald-700",
    warning: "bg-gov-warning-light border-gov-warning text-amber-700",
    danger: "bg-gov-danger-light border-gov-danger text-red-700",
  };
  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-lg border-l-4 text-sm", variants[variant], className)}>
      {icon && <span className="mt-0.5 flex-shrink-0">{icon}</span>}
      <div>{children}</div>
    </div>
  );
}

// Modal
export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  if (!open) return null;
  const sizeMap = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-2xl animate-fade-in max-h-[90vh] flex flex-col",
          sizeMap[size]
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gov-border">
          <h3 className="font-heading font-bold text-lg text-gov-navy">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gov-muted hover:bg-gray-100 hover:text-gov-text transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
