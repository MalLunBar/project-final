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
import useGeoStore, { distanceKm } from '../stores/useGeoStore'
import background from "../assets/botanical.jpg"

const LoppisInfo = () => {
  const { loppisId } = useParams()
  const { user, token } = useAuthStore()
  const { likedLoppisIds, toggleLike } = useLikesStore()
  const { openLoginModal } = useModalStore()
  const { location } = useGeoStore()
  const [loppis, setLoppis] = useState({})
  const [loppisCoords, setLoppisCoords] = useState({}) // {lat: , lng: }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isLiked = likedLoppisIds.includes(loppisId)
  const navigate = useNavigate()
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${loppisCoords.lat},${loppisCoords.lng}`

  // If the user has granted location - calculate distance to loppis
  const distance =
    location && distanceKm({ lat: location.lat, lng: location.lng }, loppisCoords)

  useEffect(() => {
    const fetchLoppisData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getLoppisById(loppisId)
        setLoppis(data)
        const coordinates = data.location.coordinates.coordinates // [lon, lat]
        setLoppisCoords({ lat: coordinates[1], lng: coordinates[0] })
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

  const handleLike = (nav = false) => {
    if (!user || !token) {
      openLoginModal('Du måste vara inloggad för att gilla en loppis!')
      return
    }
    if (nav) {
      if (!isLiked) {
        toggleLike(loppis._id, user.id, token)
      }
      navigate('/profile/favoriter')
    } else {
      toggleLike(loppis._id, user.id, token)
    }
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
    <main className='min-h-[calc(100vh-64px) md:min-h-[calc(100vh-72px)] bg-center bg-no-repeat bg-cover'
      style={{ backgroundImage: `url(${background})` }}>
      <section className='mx-auto max-w-6xl sm:px-6 sm:py-10'>
        <div className='flex flex-col gap-6 lg:gap-8 bg-white sm:bg-white/90 backdrop-blur sm:rounded-3xl shadow-xl border border-zinc-200 p-4 pb-8 md:px-10 md:pt-8 lg:px-14 lg:pb-10 xl:px-20'>
          {/* Back button and like button */}
          <div className='flex items-center justify-between -mb-2'>
            <button
              onClick={handleBack}
              className="group inline-flex items-center gap-1 text-sm cursor-pointer hover:underline underline-offset-2"
            >
              <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
              Tillbaka
            </button>

            <LikeButton onLike={() => handleLike(false)} isLiked={isLiked} />
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
                <h1 className="text-2xl font-bold">{loppis.title}</h1>
                <p className="text-sm text-muted-foreground">{loppis.location?.address?.city}</p>
              </div>
              {/* If user has granted location - show distance to loppis */}
              {distance && (
                <div className="flex gap-1 items-center">
                  <Navigation size={18} fill="#fca742" stroke="#fca742" />
                  <p>
                    {distance < 1
                      ? `${Math.round(distance * 1000)} m bort`
                      : `${distance.toFixed(1)} km bort`}
                  </p>
                </div>
              )}
            </div>
            {/* Kategorier */}
            <div className="flex flex-wrap gap-y-1">
              {loppis.categories?.map((category, index) => {
                return <Tag
                  key={index}
                  text={category}
                />
              })}
            </div>
          </div>

          {/* divider */}
          <div className="h-px bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100" />

          {/* Info och plats */}
          <div className='flex flex-col md:flex-row justify-between gap-6 lg:gap-8 md:gap-x-12'>
            {/* info */}
            <div className='flex flex-1 flex-col gap-6 lg:gap-8'>
              {/* Beskrivning */}
              {loppis.description && (
                <div className='space-y-1'>
                  <h2 className='text-lg font-semibold'>Om denna loppis</h2>
                  <p>{loppis.description}</p>
                </div>
              )}

              {/* Detaljer */}
              <div className="space-y-3">
                <h2 className='text-lg font-semibold'>Detaljer</h2>
                {/* Öppettider */}
                <div className="space-y-2">
                  {loppis.dates.map((date, idx) =>
                    <Details
                      key={`date-${idx}`}
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
            <div className='space-y-1 md:w-1/3'>
              <h2 className='text-lg font-semibold'>Plats</h2>
              {/* Karta med pin */}
              <SmallMap coordinates={[loppis.location.coordinates.coordinates[1], loppis.location.coordinates.coordinates[0]]} />
            </div>
          </div>

          {/* divider */}
          <div className="h-px bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100" />

          {/* Links */}
          <div className='flex flex-wrap gap-x-4 gap-y-3 md:gap-y-4 my-2'>
            {/* Länk till vägbeskrivning */}
            <a
              href={directionsUrl}
              target='_blank'
              className='flex justify-center items-center gap-2 bg-button hover:bg-button-hover py-2 px-4 rounded-full shadow-md hover:shadow-lg font-medium text-button-text hover:text-button-text-hover transition cursor-pointer'
            >
              <Map size={20} />
              <p>Vägbeskrivning</p>
            </a>
            <Button icon={Heart} text='Spara loppis' onClick={() => handleLike(true)} active={true} />
            <Button icon={CalendarDays} text='Lägg till i kalender' />
          </div>

        </div>

      </section>

    </main>
  )
}

export default LoppisInfo