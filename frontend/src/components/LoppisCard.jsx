import { useState } from 'react'
import { Link } from 'react-router'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { MapPinned, Clock, CircleX, Loader2 } from 'lucide-react'
import Tag from './Tag'
import LikeButton from './LikeButton'
import Details from './Details'
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'
import { IMG } from '../utils/imageVariants'
import useLikesStore from '../stores/useLikesStore'
import useLoppisUpdateStore from '../stores/useLoppisUpdateStore'

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
  variant = 'search', // 'search' | 'map' | 'profile'
  onClose,            // map: stäng popup
  showItemActions = 'false', // profile: om redigeringsläge är på
  onEdit,                     // profile: klick på penna på kortet
}) => {

  const { user, token } = useAuthStore()
  const { openLoginModal } = useModalStore()
  const { likedLoppisIds, toggleLike } = useLikesStore()
  const isUpdating = useLoppisUpdateStore((s) => s.updating[loppis._id])

  // Hämta publicId för omslagsbild:
  const id = loppis.coverImage ?? loppis.images?.[0] ?? null


  const address = `${loppis.location.address.street}, ${loppis.location.address.city}`
  const dateString = `${format(loppis.dates[0].date, 'EEE d MMMM', { locale: sv })}, kl ${loppis.dates[0].startTime}-${loppis.dates[0].endTime}`

  // check if loppis is liked by current user
  const isLiked = likedLoppisIds?.includes(loppis._id)

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
    <article className='bg-white flex flex-col gap-3 justify-between p-5 rounded-2xl shadow-xl'>
      {/* MAP: visa kryss som stänger popup */}
      <div className='absolute top-2 right-2'>
        {variant === 'map' && (
          <button
            aria-label='Stäng'
            title='Stäng'
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
            className='p-1.5 rounded-md cursor-pointer hover:bg-gray-100'
          >
            <CircleX size={25} fill={'white'} />
          </button>
        )}
      </div>

      <div className='relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100'>
        {IMG.card(id) ? (
          <img
            src={IMG.card(id)}
            srcSet={`${IMG.card(id)} 1x, ${IMG.card2x(id)} 2x`}
            alt={`${loppis.title} cover image`}
            className="w-full h-full object-cover object-center rounded-2xl"
            loading="lazy"
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-400'>
            Ingen bild
          </div>
        )}

        {isUpdating && (
          <div className="absolute inset-0 grid place-items-center bg-white/55 backdrop-blur-[1px]">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
      </div>


      <div className='flex flex-col flex-1 justify-between w-full gap-2'>
        <div className='flex items-start justify-between gap-2'>
          <Link to={`/loppis/${loppis._id}`}>
            <h3 className='font-semibold text-lg text-black hover:underline underline-offset-2'>{loppis.title}</h3>
          </Link>

          <LikeButton onLike={likeLoppis} isLiked={isLiked} />
        </div>
        {/*if there are any categories, map them here*/}
        <div className='flex flex-wrap gap-y-1'>
          {loppis.categories.map((category, index) => (
            <Tag
              key={index}
              text={category} />
          ))}
        </div>
        <div className='flex flex-col gap-1'>
          <Details
            icon={MapPinned}
            text={address} />
          <Details
            icon={Clock}
            text={dateString} />
        </div>

      </div>
    </article>
  )
}

export default LoppisCard