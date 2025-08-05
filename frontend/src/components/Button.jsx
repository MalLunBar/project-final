

const Button = ({ text, icon: Icon, type, onClick, ariaLabel }) => {
  return (
    <button
      className='bg-accent'
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {text}
      {Icon && <Icon color='#000000' />}
    </button>

  )
}

export default Button

