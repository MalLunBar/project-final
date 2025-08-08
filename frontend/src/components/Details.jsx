const Details = ({ icon: Icon, text }) => {
  return (
    <div className='flex gap-2'>
      <Icon />
      <p>{text}</p>
    </div>
  )
}

export default Details