


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
        className="border border-border rounded-3xl py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-accent"
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