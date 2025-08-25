// src/components/ErrorBanner.jsx
import { X } from "lucide-react"

const styles = {
  error:   "bg-red-50 text-red-800 border-red-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  info:    "bg-sky-50 text-sky-800 border-sky-200",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
}

const ErrorBanner = ({ children, type = "error", onClose, className = "" }) => {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`w-full rounded-md border px-3 py-2 ${styles[type]} ${className}`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 text-sm">{children}</div>
        {onClose && (
          <button
            type="button"
            aria-label="Stäng meddelande"
            onClick={onClose}
            className="opacity-70 hover:opacity-100"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorBanner
