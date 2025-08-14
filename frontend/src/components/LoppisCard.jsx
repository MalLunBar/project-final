import { Link } from 'react-router'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { MapPinned, Clock, PencilLine, CircleX } from 'lucide-react'
import Tag from './Tag'
import LikeButton from './LikeButton'
import Details from './Details'

const LoppisCard = ({
  loppis,
  variant = 'search', // 'search' | 'map' | 'profile'
  onclose,            // map: stäng popup
  showItemActions = 'false', // profile: om redigeringsläge är på
  onEdit,                     // profile: klick på penna på kortet
}) => {

  const address = `${loppis.location.address.street}, ${loppis.location.address.city}`
  const dateString = `${format(loppis.dates[0].date, 'EEE d MMMM', { locale: sv })}, kl ${loppis.dates[0].startTime}-${loppis.dates[0].endTime}`

  /*TILLFÄLLIGT HÄMTA ALLA LOPPISAR*/


  return (
    <article className='flex rounded-xl'>

      <img
        src={loppis.imageUrl}
        alt={`${loppis._id}-image`}
        className='w-20 rounded-l-xl object-cover'
      />

      <div className='flex justify-between items-start p-4'>

        <div className='flex flex-col gap-2 p-2'>
          <div className='flex items-start gap-2'>
            <Link to={`/loppis/${loppis._id}`}>
              <h3 className='font-semibold text-base'>{loppis.title}</h3>
            </Link>

            <LikeButton />
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
            className='p-1.5 rounded-md border hover:bg-gray-50'
          >
            <CircleX className='w-4 h-4' />
          </button>
        )}

        {/* PROFILE (redigeringsläge): visa penna på varje kort */}
        {variant === 'profile' && showItemActions && (
          <button
            aria-label='Redigera'
            title='Redigera'
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(loppis)
            }}
            className='p-1.5 rounded-md border hover:bg-gray-50'
          >
            <PencilLine className='w-4 h-4' />
          </button>
        )}
      </div>
    </article>
  )
}

export default LoppisCard