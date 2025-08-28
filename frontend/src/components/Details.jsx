const Details = ({ icon: Icon, text }) => {

  return (
    <div className='flex gap-2 items-center'>
      <Icon />
      <span className='text-sm whitespace-pre-line'>
        {text}
      </span>
    </div>
  )
}

export default Details