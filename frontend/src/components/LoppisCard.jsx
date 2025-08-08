import { Link } from 'react-router'
import { MapPin, Clock } from 'lucide-react'
import Tag from './Tag'
import LikeButton from './LikeButton'
import Details from './Details'

const LoppisCard = ({ loppis }) => {

  // Placeholder image
  const image = "loppis-placeholder-image.png"

  return (
    <article className='flex p-2 gap-2 rounded-xl border'>

      <img
        src={image}
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

          <Details icon={MapPin} text={loppis.address} />
          <Details icon={Clock} text={`${loppis.startTime} - ${loppis.endTime}`} />

        </div>

        <LikeButton />
      </div>

    </article>
  )
}

export default LoppisCard