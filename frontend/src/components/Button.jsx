const Button = ({ text, icon: Icon, type, onClick, active, ariaLabel }) => {
  const baseStyles = 'flex justify-center items-center gap-2 rounded-full shadow-md hover:shadow-lg transition cursor-pointer'

  const colorStyles =              // this can me changed later
    type === 'submit' || active
      ? 'bg-accent font-semibold'
      : 'bg-white border-2 border-accent'

  const sizeStyles =           // fixed circle size if no text (only icon)
    !text
      ? "w-10 h-10"
      : "py-2 px-4"

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${colorStyles}`}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel || text}
    >
      {Icon && <Icon size={20} />}
      {text}
    </button>
  )
}

export default Button

