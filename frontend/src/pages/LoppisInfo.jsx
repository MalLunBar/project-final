import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Clock, MapPin, Navigation, CalendarDays, Map } from 'lucide-react'
import Tag from '../components/Tag'
import Button from '../components/Button'

const LoppisInfo = () => {
  const { loppisId } = useParams()
  const [loppis, setLoppis] = useState({})
  const fetchUrl = `http://localhost:8080/loppis/${loppisId}`

  console.log('Loppis id:', loppisId)

  useEffect(() => {
    const fetchLoppisData = async () => {
      try {
        const response = await fetch(fetchUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch loppis data')
        }
        const data = await response.json()
        console.log(data.response)
        setLoppis(data.response)
        console.log(loppis.title)
      } catch (error) {
        console.error('Error fetching loppis data:', error)
      } finally {
        console.log('Loppis data fetched successfully')
        //här kan vi ha loading set to false 
      }
    }
    fetchLoppisData()
  }, [])

  return (
    <section>

      {/* Tillbaka-knapp */}
      {/* Gilla-knapp */}

      {/* BILD */}

      <div>
        <div className='flex justify-between'>
          <h2>{loppis.title}</h2>
          <span>
            <Navigation />
            <p>2 km bort</p>
          </span>
        </div>
        <p>{loppis.address}</p>
      </div>

      <div>
        {loppis.categories.map((category, index) => {
          return <Tag
            key={index}
            text={category} />
        })}
      </div>

      <div>
        <span>
          <Clock />
          <p>{loppis.startTime} - {loppis.endTime}</p>
        </span>
        <span>
          <MapPin />
          <p>{loppis.address}</p>
        </span>
      </div>

      {/* Array av fler bilder */}

      <p>{loppis.description}</p>

      {/*  liten karta som visar loppisens plats? */}

      <div className='flex'>
        <Button
          icon={Map}
          text='Få vägbeskrivning'
        />
        <Button
          icon={CalendarDays}
          text='Lägg till i kalender'
        />
      </div>
    </section>
  )
}

export default LoppisInfo