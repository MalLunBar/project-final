import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Clock, MapPinned, Navigation, CalendarDays, Map, Heart } from 'lucide-react'
import Tag from '../components/Tag'
import Button from '../components/Button'
import Details from '../components/Details'
import LikeButton from '../components/LikeButton'
import SmallMap from '../components/SmallMap'
import { cldUrl } from '../utils/cloudinaryUrl'
import { IMG } from '../utils/imageVariants'
import useLikesStore from '../stores/useLikesStore'
import useAuthStore from '../stores/useAuthStore'
import { getLoppisById } from '../services/loppisApi'
import useModalStore from '../stores/useModalStore'

const LoppisInfo = () => {
  const { loppisId } = useParams()
  const { user, token } = useAuthStore()
  const { likedLoppisIds, toggleLike } = useLikesStore()
  const { openLoginModal } = useModalStore()
  const [loppis, setLoppis] = useState({})
  const [directionsUrl, setDirectionsUrl] = useState('https://www.google.com/maps/')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isLiked = likedLoppisIds.includes(loppisId)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLoppisData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getLoppisById(loppisId)
        setLoppis(data)
        const coordinates = data.location.coordinates.coordinates // [lon, lat]
        setDirectionsUrl(`https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`)
      } catch (err) {
        // --------------------TODO: handle error appropriately
        console.error('Failed to fetch loppis data:', err)
        setError(err.message || 'Kunde inte hämta loppisdata')
      } finally {
        setLoading(false)
      }
    }
    fetchLoppisData()
  }, [loppisId])

  const handleBack = () => {
    // if the user came directly to the LoppisInfo page via a shared link, there may be no "previous page", in that case, you might want a fallback route
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1) // goes back one step in history
    } else {
      navigate("/search") // fallback
    }
  }

  const handleLike = () => {
    if (!user || !token) {
      openLoginModal('Du måste vara inloggad för att gilla en loppis!')
      return
    }
    toggleLike(loppis._id, user.id, token)
  }

  // -------------------------TODO: add loading component
  if (loading) {
    return <p>Loading...</p>
  }
  // -------------------------TODO: add error component?
  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  // --- Bild-URLs (NYTT) ---
  const coverId = loppis.coverImage ?? loppis.images?.[0] ?? null

  // Galleri-tumnaglar (om fler bilder finns)
  const gallery = (loppis.images || []).slice(1)


  const addressLine = `${loppis.location?.address?.street}, ${loppis.location?.address?.city}`

  const dateToString = (date) => {
    return `${format(date.date, 'EEEE d MMMM', { locale: sv })}, kl ${date.startTime}-${date.endTime}`
  }

  return (
    <main className='flex min-h-[calc(100vh-64px) md:min-h-[calc(100vh-72px)] bg-[url(../botanical.jpg)] bg-center bg-no-repeat bg-cover md:py-8'>
      <section className='flex flex-col gap-6 lg:gap-8 w-full md:w-7/8 lg:w-5/6 max-w-5xl bg-white md:rounded-3xl shadow-xl mx-auto my-auto p-4 pb-8 md:px-10 md:pt-8 lg:px-14 lg:pb-10 xl:px-20'>

        {/* Back button and like button */}
        <div className='flex items-center justify-between -mb-2'>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 text-sm cursor-pointer hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Tillbaka
          </button>

          <LikeButton onLike={handleLike} isLiked={isLiked} />
        </div>


        {/* Bilder */}
        <div className='flex flex-col md:flex-row gap-2'>
          {/* HERO-BILD (NYTT) */}
          {coverId ? (
            <img
              src={IMG.heroSm(coverId)}
              srcSet={`${IMG.hero(coverId)} 1200w, ${IMG.heroLg(coverId)} 1600w`}
              sizes="(max-width: 768px) 92vw, (max-width: 1024px) 85vw, 1200px"
              alt={loppis.title}
              className="w-full h-52 md:h-96 object-cover rounded-2xl"
              loading="eager"
            />
          ) : (
            <div className="w-full h-64 md:h-96 rounded-2xl bg-gray-200" />
          )}

          {/* GALLERI (NYTT) */}
          {gallery.length > 0 && (
            <div className="flex md:flex-col md:w-1/3 flex-wrap gap-2">
              {gallery.map((image, index) => (
                <img
                  key={index}
                  src={IMG.thumb(image)}
                  srcSet={`${IMG.thumb2x(image)} 480w`}
                  sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 240px"
                  alt={`Galleri bild ${index + 1}`}
                  className="md:w-full h-24 md:h-1/3 object-cover rounded-lg"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        {/* Titel, plats och kategorier */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{loppis.title}</h1>
              <p className="text-sm text-muted-foreground">{loppis.location?.address?.city}</p>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Navigation size={18} fill="#FF8242" stroke="#FF8242" />
              <p>2 km bort</p>
            </div>
          </div>
          {/* Kategorier */}
          <div className="flex flex-wrap gap-y-1">
            {loppis.categories?.map((category, index) => {
              return <Tag
                key={index}
                text={category} />
            })}
          </div>
        </div>

        {/* divider */}
        <hr className='-my-1 border-t border-gray-400' />

        {/* Info och plats */}
        <div className='flex flex-col md:flex-row justify-between gap-6 lg:gap-8 lg:gap-x-12'>
          {/* info */}
          <div className='flex flex-col gap-6 lg:gap-8'>
            {/* Beskrivning */}
            <div className='space-y-1'>
              <h2 className='font-semibold'>Om denna loppis</h2>
              <p>{loppis.description}</p>
            </div>

            {/* Detaljer */}
            <div className="space-y-3">
              <h2 className='font-semibold'>Detaljer</h2>
              {/* Öppettider */}
              <div className="space-y-2">
                {loppis.dates.map(date =>
                  <Details
                    icon={Clock}
                    text={dateToString(date)}
                  />)}
              </div>
              {/* Adress */}
              <div>
                <Details
                  icon={MapPinned}
                  text={addressLine}
                />
              </div>
            </div>
          </div>
          {/* Plats */}
          <div className='space-y-1 md:w-1/2 lg:w-1/3'>
            <h2 className='font-semibold'>Plats</h2>
            {/* Karta med pin */}
            <SmallMap coordinates={[loppis.location.coordinates.coordinates[1], loppis.location.coordinates.coordinates[0]]} />
          </div>
        </div>

        {/* divider */}
        <hr className='border-t border-gray-400' />

        {/* Links */}
        <div className='flex justify-center flex-wrap gap-x-6 gap-y-2 my-4'>
          {/* Länk till vägbeskrivning */}
          <a
            href={directionsUrl}
            target='_blank'
            className='flex justify-center items-center gap-2 bg-accent py-2 px-4 rounded-full shadow-md hover:shadow-lg transition cursor-pointer'
          >
            <Map size={20} />
            <p>Vägbeskrivning</p>
          </a>
          <Button icon={Heart} text='Spara i mina favoriter' />
          <Button icon={CalendarDays} text='Lägg till i min kalender' />
        </div>

      </section>

    </main>
  )
}

export default LoppisInfo