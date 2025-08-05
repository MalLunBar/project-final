


const Input = ({ type, title, name, label, value, onChange, required, showLabel = true }) => {
  return (
    <>

      {showLabel && (
        <label
          htmlFor={title} className="sr-only">
          {label}
        </label>
      )}

      <input
        type={type}
        id={title}
        title={title}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        required={required}
      />
    </>
  )
}

export default Input