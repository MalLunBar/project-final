
import { Link } from 'react-router'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { MapPinned, Clock, CircleX } from 'lucide-react'
import Tag from './Tag'
import LikeButton from './LikeButton'
import Details from './Details'
import { IMG } from '../utils/imageVariants'

const LoppisCard = ({
  loppis,
  variant = 'search', // 'search' | 'map' | 'profile'
  onClose,            // map: stäng popup
  showItemActions = 'false', // profile: om redigeringsläge är på
  onEdit,                     // profile: klick på penna på kortet
}) => {

  // Hämta publicId för omslagsbild:
  const id = loppis.coverImage ?? loppis.images?.[0] ?? null


  const address = `${loppis.location.address.street}, ${loppis.location.address.city}`
  const dateString = `${format(loppis.dates[0].date, 'EEE d MMMM', { locale: sv })}, kl ${loppis.dates[0].startTime}-${loppis.dates[0].endTime}`

  /*TILLFÄLLIGT HÄMTA ALLA LOPPISAR*/


  return (
    <article className='bg-accent-light flex flex-col gap-2 rounded-xl'>
      <div>
        <img
          src={IMG.card(id)}
          srcSet={`${IMG.card(id)} 1x, ${IMG.card2x(id)} 2x`}
          alt={loppis.title}
          className="w-40 h-36 md:w-32 md:h-24 object-cover rounded-l-xl"
          loading="lazy"
        />
      </div>

      <div className='flex justify-between items-start px-4'>

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