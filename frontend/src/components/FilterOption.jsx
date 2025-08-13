const FilterOption = ({ type, name, value, label, selected, onChange }) => {
  return (
    <label
      className={`px-3 py-1.5 rounded-full border text-sm cursor-pointer select-none 
                ${selected
          ? "bg-light border-text"
          : "bg-white text-gray-700 border-border hover:bg-hover"
        }`}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={selected}
        onChange={onChange}
        className='sr-only'
      />
      {label}
    </label>
  )
}

export default FilterOption

