const Input = ({ type, id, label, placeholder, value, onChange, required, showLabel }) => {
  const showFakePlaceholder =
    (type === "date" || type === "time") && !value

  return (
    <div className="flex-grow min-w-0 flex flex-col gap-2 relative">
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
        placeholder={placeholder ? placeholder : label}
        required={required}
      />

      {/* Fake placeholder for date/time inputs on mobile and tablet */}
      {showFakePlaceholder && (
        <span className="absolute left-4 top-[70%] -translate-y-1/2 text-gray-400 pointer-events-none text-base md:hidden">
          {placeholder}
        </span>
      )}
    </div>
  )
}

export default Input