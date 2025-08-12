import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { useParams } from 'react-router-dom'
import { Clock, MapPinned, Navigation, CalendarDays, Map } from 'lucide-react'
import Tag from '../components/Tag'
import Button from '../components/Button'
import Details from '../components/Details'
import LikeButton from '../components/LikeButton'

const LoppisInfo = () => {
  const { loppisId } = useParams()
  const [loppis, setLoppis] = useState({})
  const [loading, setLoading] = useState(true)
  const fetchUrl = `http://localhost:8080/loppis/${loppisId}`

  useEffect(() => {
    const fetchLoppisData = async () => {
      try {
        setLoading(true)
        const response = await fetch(fetchUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch loppis data')
        }
        const data = await response.json()
        setLoppis(data.response)
      } catch (error) {
        // --------------------TODO: handle error appropriately
        console.error('Error fetching loppis data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLoppisData()
  }, [])

  // -------------------------TODO: add loading component
  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <section>

      {/* Tillbaka-knapp */}

      <LikeButton />


      <img
        src={loppis.imageUrl}
        alt={`${loppis._id}-image`}
        className='w-full object-fit'
      />


      {/* Titel och plats */}
      <div>
        <div className='flex justify-between gap'>
          <h2>{loppis.title}</h2>
          <div className='flex items-center gap-1'>
            <Navigation fill='#FF8242' stroke='#FF8242' />
            <p>2 km bort</p>
          </div>
        </div>
        <p>{loppis.location.address.city}</p>
      </div>


      {/* Kategorier */}
      <div>
        {loppis.categories?.map((category, index) => {
          return <Tag
            key={index}
            text={category} />
        })}
      </div>

      {/* Detaljer */}
      <div>
        <Details
          icon={Clock}
          text={
            loppis?.dates?.[0]
              ? `${format(loppis.dates[0].date, 'EEEE d MMMM', { locale: sv })}, 
            kl ${loppis.dates[0].startTime}-${loppis.dates[0].endTime}`
              : 'Inga datum angivna'
          }
        />
        <Details
          icon={MapPinned}
          text={
            `${loppis.location.address.street},
          ${loppis.location.address.postalCode} ${loppis.location.address.city}`
          }
        />
      </div>

      {/* Array av fler bilder */}

      {/* Beskrivning */}
      <p>{loppis.description}</p>

      {/*  liten karta som visar loppisens plats? */}

      {/* Knappar */}
      <div className='flex flex-wrap gap-2'>
        <Button icon={Map} text='Vägbeskrivning' />
        <Button icon={CalendarDays} text='Lägg till i kalender' />
      </div>
    </section>
  )
}

export default LoppisInfo