const FilterOption = ({ type = 'checkbox', name, value, label, checked, onChange, id }) => {
  const inputId = id || `${name}-${String(value).replace(/\s+/g, "-")}`
  return (
    <label
      htmlFor={inputId}
      className={`px-3 py-1.5 rounded-full border text-sm cursor-pointer select-none 
                ${checked
          ? "bg-light border-text"
          : "bg-white text-gray-700 border-border hover:bg-hover"
        }`}
    >
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className='sr-only'
      />
      {label}
    </label>
  )
}

export default FilterOption

