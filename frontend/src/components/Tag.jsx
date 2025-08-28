

const Tag = ({ text, classNames }) => {
  return (
    <span
      className={`inline-block bg-light text-sm text-nav font-medium mr-2 px-3 py-1.5 rounded-full ${classNames}`}
    >
      {text}
    </span>
  )
}

export default Tag