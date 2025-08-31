
const FieldError = ({ id, show = true, className = '', children }) => {
  // rendera inget om vi inte uttryckligen ska visa, eller om det saknas text
  if (!show || !children) return null

  return (
    <p
      id={id}
      role="alert"
      aria-live="polite"
      className={`mt-1 text-xs text-red-600 ${className}`}
    >
      {children}
    </p>
  )
}

export default FieldError