

const Button = ({ text, icon, type, onClick, ariaLabel }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {text && {text}}
      {icon && <img src={icon} alt={text} />}
    </button>

  )
}

export default Button
