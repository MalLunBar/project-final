//finns det ett bättre sätt att gömma label? 


const Input = ({ type, title, label, value, onChange, required, ariaHidden }) => {
  return (
    <>
      <label
        htmlFor={title}
        aria-hidden={ariaHidden}
      >
        {label}
      </label>
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