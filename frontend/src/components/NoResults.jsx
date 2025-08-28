import { AlertCircle } from 'lucide-react'

const NoResults = ({ title, message }) => {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center p-6 text-center"
    >
      <AlertCircle
        size={48}
        className="mb-4 text-button"
        aria-hidden="true"
      />
      <h2 className="text-lg font-semibold text-yellow-800 mb-2">
        {title}
      </h2>
      <p className="text-sm text-yellow-700">
        {message}
      </p>
    </div>
  )
}

export default NoResults