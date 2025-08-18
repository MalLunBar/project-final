import { useState } from 'react'
import { Link } from 'react-router'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { MapPinned, Clock, PencilLine, CircleX } from 'lucide-react'
import Tag from './Tag'
import LikeButton from './LikeButton'
import Details from './Details'
import useAuthStore from '../stores/useAuthStore'

const LoppisCard = ({
  loppis,
  variant = 'search', // 'search' | 'map' | 'profile'
  onClose,            // map: stäng popup
  showItemActions = 'false', // profile: om redigeringsläge är på
  onEdit,                     // profile: klick på penna på kortet
}) => {

  const { user, token } = useAuthStore()

  const address = `${loppis.location.address.street}, ${loppis.location.address.city}`
  const dateString = `${format(loppis.dates[0].date, 'EEE d MMMM', { locale: sv })}, kl ${loppis.dates[0].startTime}-${loppis.dates[0].endTime}`

  const url = 'http://localhost:8080/loppis/'

  // tillfälligt state för like-knapp
  const [liked, setLiked] = useState(false)

  // toggle like state and send like request to backend 
  const likeLoppis = async (e) => {
    e.stopPropagation() // förhindra att kortet klickas på
    console.log('Gillar loppis: ', loppis._id)
    if (!user || !token) {
      console.error("Användare är inte inloggad eller saknar token.")
      return
    }
    try {
      const response = await fetch(`${url}/${loppis._id}/like`, {
        method: 'PATCH',
        headers: { 'Authorization': token }
      })
      if (!response.ok) {
        throw new Error('Något gick fel vid gillande av loppis.')
      }
      const data = await response.json()
      console.log('Backend svar: ', data)

      setLiked(!liked) // växla liked state
    } catch (error) {
      console.error('Fel vid gillande av loppis:', error)
    } finally {
      //
    }
  }

  return (
    <article className='bg-accent-light flex rounded-xl'>

      <img
        src={loppis.imageUrl}
        alt={`${loppis._id}-image`}
        className='w-20 rounded-l-xl object-cover'
      />

      <div className='flex justify-between items-start p-4'>

        <div className='flex flex-col gap-2 p-2'>
          <div className='flex items-start justify-between gap-2'>
            <Link to={`/loppis/${loppis._id}`}>
              <h3 className='font-semibold text-base'>{loppis.title}</h3>
            </Link>

            <LikeButton onLike={likeLoppis} liked={liked} />
          </div>
          {/*if there are any categories, map them here*/}
          <div className='flex flex-wrap'>
            {loppis.categories.map((category, index) => (
              <Tag
                key={index}
                text={category} />
            ))}
          </div>

          <Details
            icon={MapPinned}
            text={address} />
          <Details
            icon={Clock}
            text={dateString} />

        </div>
      </div>


      <div className='absolute top-2 right-2 flex items-center gap-2'>
        {/* MAP: visa kryss som stänger popup */}
        {variant === 'map' && (
          <button
            aria-label='Stäng'
            title='Stäng'
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
            className='p-1.5 rounded-md hover:bg-gray-50'
          >
            <CircleX size={20} />
          </button>
        )}

      </div>
    </article>
  )
}

export default LoppisCard