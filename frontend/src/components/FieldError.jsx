
const FieldError = ({ children, id }) => {
  if (!children) return null
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-red-600">
      {children}
    </p>
  )
}
export default FieldError