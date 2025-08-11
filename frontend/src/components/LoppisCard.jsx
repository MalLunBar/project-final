import { Link } from 'react-router'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { MapPinned, Clock } from 'lucide-react'
import Tag from './Tag'
import LikeButton from './LikeButton'
import Details from './Details'

const LoppisCard = ({ loppis }) => {

  const address = `${loppis.location.address.street}, ${loppis.location.address.city}`
  const dateString = `${format(loppis.dates[0].date, 'EEE d MMMM', { locale: sv })}, kl ${loppis.dates[0].startTime}-${loppis.dates[0].endTime}`

  return (
    <article className='flex p-2 gap-2 rounded-xl border'>

      <img
        src={loppis.imageUrl}
        alt={`${loppis._id}-image`}
        className='w-20 -ml-2 -my-2 rounded-l-xl object-cover'
      />

      <div className='flex w-100 justify-between items-start'>

        <div className='flex flex-col'>
          <Link to={`/loppis/${loppis._id}`}>
            <h3>{loppis.title}</h3>
          </Link>

          {/*if there are any categories, map them here*/}
          <div>
            {loppis.categories.map((category, index) => (
              <Tag
                key={index}
                text={category} />
            ))}
          </div>

          <Details icon={MapPinned} text={address} />
          <Details icon={Clock} text={dateString} />

        </div>

        <LikeButton />
      </div>

    </article>
  )
}

export default LoppisCard