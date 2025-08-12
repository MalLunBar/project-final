import { Heart } from 'lucide-react'

const LikeButton = ({ liked, onLike }) => {

  const fill = liked ? 'red' : 'white'
  const stroke = liked ? 0 : 2

  return (
    <button
      type='button'
      onClick={onLike}
      className='cursor-pointer absolute right-2 top-2'
    >
      <Heart color='#F88B53' strokeWidth={stroke} fill={fill} />
    </button>
  )
}

export default LikeButton