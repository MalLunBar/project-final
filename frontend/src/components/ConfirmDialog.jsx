import { Loader, X } from 'lucide-react'

const ConfirmDialog = ({
  open,
  title = 'Bekräfta',
  message,
  confirmText = 'Ja',
  cancelText = 'Nej',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      {/* panel */}
      <div className="relative z-10 w-[94vw] max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
            aria-label="Stäng"
            title="Stäng"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-700">{message}</p>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-200 cursor-pointer"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-800 disabled:opacity-60 cursor-pointer"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" size={18} /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
