


const Input = ({ type, id, label, value, onChange, required, showLabel = true }) => {
  return (
    <>

      {showLabel && (
        <label
          htmlFor={id} className="sr-only">
          {label}
        </label>
      )}

      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={label}
        required={required}
      />
    </>
  )
}

export default Input