

const Button = ({ text, icon: Icon, type, onClick, ariaLabel }) => {
  return (
    <button
      className={`flex justify-center py-2 px-4 gap-2 rounded-3xl cursor-pointer ${type === 'submit' ? 'bg-accent font-semibold' : 'bg-white border-2 border-accent'}`}
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

