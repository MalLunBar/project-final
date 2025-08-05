


const Input = ({ type, title, label, value, onChange, required, showLabel = true }) => {
  return (
    <>

      {showLabel && (
        <label htmlFor={title} className="sr-only">
          {label}
        </label>
      )}

      <input
        type={type}
        id={title}
        title={title}
        value={value}
        onChange={onChange}
        placeholder={label}
        required={required}
      />
    </>
  )
}

export default Input