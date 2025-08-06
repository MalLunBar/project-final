const Menu = ({ type, children }) => {
  return (
    <ul className={`flex flex-col gap-5 ${type === 'mobile' ? 'py-5' : `${type === 'desktop' ? 'flex-row py-2' : ''}`}`}>
      {children}
    </ul>
  )
}

export default Menu