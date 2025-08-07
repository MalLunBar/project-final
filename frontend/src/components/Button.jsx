

const Button = ({ text, icon: Icon, type, onClick, ariaLabel }) => {
  return (
    <button
      className='bg-accent rounded-3xl py-2 px-4 '
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

