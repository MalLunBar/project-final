const Input = ({ type, id, label, placeholder, value, onChange, required, showLabel }) => {
  return (
    <span className="flex flex-col gap-2">
      <label
        htmlFor={id} className={`font-medium ${!showLabel ? 'sr-only' : ''}`}>
        {label}
      </label>

      <input
        className="bg-white border border-border rounded-3xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent"
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={`${placeholder ? placeholder : label}`}
        required={required}
      />
    </span>
  )
}

export default Input