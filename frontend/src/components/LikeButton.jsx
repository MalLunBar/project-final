import { Heart } from 'lucide-react'

const LikeButton = ({ isLiked, onLike, className = '' }) => {

  const fill = isLiked ? 'red' : 'white'
  const stroke = isLiked ? 0 : 2

  return (
    <button
      type='button'
      onClick={onLike}
      className={`${className} cursor-pointer`}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <Heart color='#fca742' strokeWidth={stroke} fill={fill} />
    </button>
  )
}

export default LikeButton