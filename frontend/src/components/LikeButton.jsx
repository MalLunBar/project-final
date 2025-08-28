import { Heart } from 'lucide-react'

const LikeButton = ({ isLiked, onLike, className = '' }) => {
  return (
    <button
      type='button'
      onClick={onLike}
      aria-label={isLiked ? "Unlike" : "Like"}
      aria-pressed={isLiked}
      className={`
        ${className} 
        group cursor-pointer
        focus:outline-none focus-visible:ring-2 focus:ring-button focus:ring-offset-3 rounded-full
        transition-transform
        `}
    >
      <Heart
        size={24}
        color='#fca742'
        strokeWidth={isLiked ? 0 : 2}
        fill={isLiked ? 'red' : 'white'}
        className='transition-all duration-300 group-hover:scale-120 group-active:scale-85'
      />
    </button>
  )
}

export default LikeButton