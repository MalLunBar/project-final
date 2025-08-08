

const Button = ({ text, icon: Icon, type, onClick, ariaLabel }) => {
  return (
    <button
      className='flex justify-center py-2 px-4 gap-2 bg-accent rounded-3xl cursor-pointer'
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

