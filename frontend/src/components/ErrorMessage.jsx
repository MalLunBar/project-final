import { AlertCircle } from "lucide-react"

const VARIANTS = {
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-sky-50 border-sky-200 text-sky-800",
}

const ICON_CLASSES = "w-4 h-4 shrink-0 mt-0.5"

const ErrorMessage = ({ children, variant = "error", id, className = "" }) => {
  const styles = VARIANTS[variant] || VARIANTS.error
  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      className={`rounded-xl border p-3 text-sm flex items-start gap-2 ${styles} ${className}`}
    >
      <AlertCircle className={ICON_CLASSES} aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}

export default ErrorMessage
