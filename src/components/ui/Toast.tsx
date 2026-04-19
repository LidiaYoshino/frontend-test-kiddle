import { AlertCircle, CheckCircle2, Info, X, type LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  open: boolean;
  message: string;
  onClose: () => void;
  /** Auto-dismiss delay in ms. Set to 0 to disable auto-dismiss. */
  duration?: number;
  variant?: ToastVariant;
}

const VARIANT_CLASS: Record<ToastVariant, string> = {
  success: "border-brand-teal-500 bg-brand-teal-50 text-brand-teal-700",
  error: "border-red-300 bg-red-50 text-red-700",
  info: "border-slate-200 bg-white text-slate-700"
};

const VARIANT_ICON: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info
};

export function Toast({ open, message, onClose, duration = 4000, variant = "success" }: ToastProps) {
  useEffect(() => {
    if (!open || duration <= 0) {
      return;
    }
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) {
    return null;
  }

  const Icon = VARIANT_ICON[variant];

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 sm:bottom-8 sm:justify-end sm:pr-8"
    >
      <div
        className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${VARIANT_CLASS[variant]}`}
      >
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p className="flex-1 leading-snug">{message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar notificação"
          className="-mr-1 -mt-1 rounded p-1 opacity-70 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body
  );
}
