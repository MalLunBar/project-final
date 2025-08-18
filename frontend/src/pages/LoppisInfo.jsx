import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { useParams } from 'react-router-dom'
import { Clock, MapPinned, Navigation, CalendarDays, Map } from 'lucide-react'
import Tag from '../components/Tag'
import Button from '../components/Button'
import Details from '../components/Details'
import LikeButton from '../components/LikeButton'
import { cldUrl } from '../utils/cloudinaryUrl'
import { IMG } from '../utils/imageVariants'

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

  // --- Bild-URLs (NYTT) ---
  const coverId = loppis.coverImage ?? loppis.images?.[0] ?? null

  // Galleri-tumnaglar (om fler bilder finns)
  const gallery = (loppis.images || []).slice(1)


  const addressLine = `${loppis.location?.address?.street}, ${loppis.location?.address?.city}`
  const dateText = loppis?.dates?.[0]
    ? `${format(loppis.dates[0].date, 'EEEE d MMMM', { locale: sv })}, kl ${loppis.dates[0].startTime}-${loppis.dates[0].endTime}`
    : 'Inga datum angivna'

  return (
    <section className='p-4 max-w-3xl'>

      {/* Tillbaka-knapp */}

      <LikeButton />

      {/* HERO-BILD (NYTT) */}

      {coverId ? (
        <img
          src={IMG.heroSm(coverId)}
          srcSet={`${IMG.hero(coverId)} 1200w, ${IMG.heroLg(coverId)} 1600w`}
          sizes="(max-width: 768px) 92vw, (max-width: 1024px) 85vw, 1200px"
          alt={loppis.title}
          className="w-full h-64 md:h-96 object-cover rounded-2xl"
          loading="eager"
        />
      ) : (
        <div className="w-full h-64 md:h-96 rounded-2xl bg-gray-200" />
      )}

      {/* GALLERI (NYTT) */}
      {gallery.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {gallery.map((image, index) => (
            <img
              key={index}
              src={IMG.thumb(image)}
              srcSet={`${IMG.thumb2x(image)} 480w`}
              sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 240px"
              alt={`Galleri bild ${index + 1}`}
              className="w-1/3 h-32 object-cover rounded-lg"
              loading="lazy"
            />
          ))}
        </div>
      )}
      

      {/* Titel och plats */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{loppis.title}</h2>
          <p className="text-muted-foreground">{loppis.location?.address?.city}</p>
        </div>
        <div className="flex items-center gap-1">
          <Navigation fill="#FF8242" stroke="#FF8242" />
          <p>2 km bort</p>
        </div>
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
          text={addressLine}
        />
      </div>


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