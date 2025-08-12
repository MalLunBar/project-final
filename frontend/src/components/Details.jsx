const Details = ({ icon: Icon, text }) => {

  return (
    <div className='flex gap-2'>
      <Icon />
      <p className='whitespace-pre-line'>
        {text}
      </p>
    </div>
  )
}

export default Details