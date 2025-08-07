import { Link } from 'react-router'
import Tag from './Tag'

const LoppisCard = ({ loppis }) => {


  return (
    <article>
      <Link to={`/loppis/${loppis._id}`}>
        <h3>{loppis.title}</h3>
      </Link>
      <p>{loppis.address}</p>

      {/*if there are any categories, map them here*/}
      <div>
        {loppis.categories.map((category, index) => (
          <Tag
            key={index}
            text={category} />
        ))}
      </div>



      {/* Description of the loppis */}
      <p>{loppis.description}</p>

      {/*Array of images*/}
      <p>{loppis.startTime} - {loppis.endTime}</p>

      <p>{loppis.address}</p>
      {/* Additional loppis details can be added here */}
    </article>
  )
}

export default LoppisCard