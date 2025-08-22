import { Link } from 'react-router'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { MapPinned, Clock, CircleX } from 'lucide-react'
import Tag from './Tag'
import LikeButton from './LikeButton'
import Details from './Details'
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'
import { IMG } from '../utils/imageVariants'
import useLikesStore from '../stores/useLikesStore'

const CarouselCard = ({ loppis }) => {
  const { user, token } = useAuthStore()
  const { openLoginModal } = useModalStore()
  const { likedLoppisIds, toggleLike } = useLikesStore()

  // check if loppis is liked by current user
  const isLiked = likedLoppisIds?.includes(loppis._id)
  // Hämta publicId för omslagsbild:
  const id = loppis.coverImage ?? loppis.images?.[0] ?? null
  // format date
  const dateString = `${format(loppis.dates[0].date, 'EEE d MMMM', { locale: sv })}`

  // handle click on like button 
  const likeLoppis = async (e) => {
    e.stopPropagation() // förhindra att kortet klickas på
    if (!user || !token) {
      openLoginModal('Du måste vara inloggad för att gilla en loppis!')
      return
    }
    toggleLike(loppis._id, user.id, token)
  }

  return (
    <article className="keen-slider__slide flex flex-col items-center justify-center bg-white rounded-xl shadow">
      <img src='loppis-placeholder-image.png' alt={loppis.title} className="w-full h-60 object-cover" />
      <div className='p-2 text-center' >
        <h3 className="font-medium">{loppis.title}</h3>
        <p className="text-gray-600 text-sm">{loppis.location.address.city} • This weekend</p>
      </div>
    </article>
  )
}

export default CarouselCard