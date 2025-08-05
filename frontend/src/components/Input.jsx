//finns det ett bättre sätt att gömma label? 


const Input = ({ type, name, label, value, onChange, required, ariaHidden }) => {
  return (
    <>
      <label
        htmlFor={name}
        aria-hidden={ariaHidden}
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
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