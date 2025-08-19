import { useState } from 'react'
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

// LoppisCard.jsx (bara relevanta delar)
const S = {
  container: {
    map: 'w-[280px] rounded-xl bg-white shadow-md p-2',
    profile: 'w-full rounded-xl bg-white shadow-sm p-4',
    search: 'w-full rounded-xl bg-accent-light p-2',
  },
  layout: {
    map: 'flex flex-col',                 // bild överst
    profile: 'flex',                          // bild vänster, text höger
    search: 'flex',
  },
  image: {
    map: 'w-full h-40 object-cover rounded-lg',
    profile: 'w-28 h-24 md:w-32 md:h-24 object-cover rounded-l-xl',
    search: 'w-28 h-24 object-cover rounded-l-xl',
  },
  body: {
    map: 'mt-2 space-y-1',
    profile: 'flex-1 pl-4',
    search: 'flex-1 p-4',
  },
  title: {
    map: 'text-sm font-semibold line-clamp-2',
    profile: 'text-base font-semibold',
    search: 'text-base font-semibold',
  },
  meta: {
    map: 'text-xs text-muted-foreground',
    profile: 'text-sm text-muted-foreground',
    search: 'text-sm text-muted-foreground',
  },
};


const LoppisCard = ({
  loppis,
  likedLoppis,
  setLikedLoppis,     // function to update liked loppis in parent component
  variant = 'search', // 'search' | 'map' | 'profile'
  onClose,            // map: stäng popup
  showItemActions = 'false', // profile: om redigeringsläge är på
  onEdit,                     // profile: klick på penna på kortet
}) => {

  const { user, token } = useAuthStore()
  const { openLoginModal } = useModalStore()

  // Hämta publicId för omslagsbild:
  const id = loppis.coverImage ?? loppis.images?.[0] ?? null


  const address = `${loppis.location.address.street}, ${loppis.location.address.city}`
  const dateString = `${format(loppis.dates[0].date, 'EEE d MMMM', { locale: sv })}, kl ${loppis.dates[0].startTime}-${loppis.dates[0].endTime}`

  const url = 'http://localhost:8080/loppis/'

  // check if loppis is liked by current user
  const isLiked = likedLoppis?.includes(loppis._id)

  // handle click on like button 
  const likeLoppis = async (e) => {
    e.stopPropagation() // förhindra att kortet klickas på
    if (!user || !token) {
      openLoginModal('Du måste vara inloggad för att gilla en loppis!')
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
      console.log(`Loppis ${loppis._id} ${data.response.action}!`)
      // uppdatte liked state based on response
      if (data.response.action === 'liked') {
        setLikedLoppis(prev => [...prev, loppis._id])
      } else {
        setLikedLoppis(prev => prev.filter(id => id !== loppis._id))
      }
    } catch (error) {
      console.error('Fel vid gillande av loppis:', error)
    } finally {
      //
    }
  }

  return (
    <article className='bg-white flex flex-col gap-2 rounded-xl'>
      <div className='w-full aspect-[4/3]overflow-hidden rounded-xl flex'>
        <img
          src={IMG.card(id)}
          srcSet={`${IMG.card(id)} 1x, ${IMG.card2x(id)} 2x`}
          alt={loppis.title}
          className="w-full h-full object-cover object-center border-20 border-white rounded-2xl"
          loading="lazy"
        />
      </div>

      <div className='flex justify-between items-start px-4 pb-4'>

        <div className='flex flex-col gap-2'>
          <div className='flex items-start justify-between gap-2'>
            <Link to={`/loppis/${loppis._id}`}>
              <h3 className='font-semibold text-base'>{loppis.title}</h3>
            </Link>

            <LikeButton onLike={likeLoppis} isLiked={isLiked} />
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