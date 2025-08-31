import { Link } from 'react-router-dom' // viktigt: dom-varianten
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { MapPinned, Clock, CircleX, Loader2 } from 'lucide-react'
import Tag from './Tag'
import LikeButton from './LikeButton'
import Details from './Details'
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'
import { IMG } from '../utils/imageVariants'
import useLikesStore from '../stores/useLikesStore'
import useLoppisUpdateStore from '../stores/useLoppisUpdateStore'

// Din S kan vara exakt som du hade den:
const S = {
  container: {
    // mindre på mobil (<sm), original från sm↑
    map: 'w-[240px] sm:w-[280px] rounded-xl bg-white shadow-md p-2',
    profile: 'w-full rounded-3xl bg-white shadow-sm p-4 flex flex-col h-[380px] sm:h-[420px]',
    search: 'w-full rounded-xl bg-accent-light p-2',
  },
  layout: { map: 'flex flex-col', profile: 'flex', search: 'flex' },
  image: {
    // lägre bild på mobil, original från sm↑
    map: 'w-full h-32 sm:h-40 object-cover rounded-lg',
    profile: 'w-28 h-24 md:w-32 md:h-24 object-cover rounded-l-xl',
    search: 'w-28 h-24 object-cover rounded-l-xl',
  },
  body: {
    map: 'mt-2 space-y-1',
    profile: 'flex-1 pl-4',
    search: 'flex-1 p-4',
  },
  title: {
    map: 'text-sm font-semibold line-clamp-2',
    profile: 'text-base font-semibold line-clamp-2',
    search: 'text-base font-semibold',
  },
  meta: {
    map: 'text-xs text-muted-foreground',
    profile: 'text-sm text-muted-foreground',
    search: 'text-sm text-muted-foreground',
  },
}

const LoppisCard = ({
  loppis,
  variant = 'search',   // 'search' | 'map' | 'profile'
  onClose,
}) => {
  const { user, token } = useAuthStore()
  const { openLoginModal } = useModalStore()
  const { likedLoppisIds, toggleLike } = useLikesStore()
  const isUpdating = useLoppisUpdateStore(s => s.updating[loppis._id])

  const id = loppis.coverImage ?? loppis.images?.[0] ?? null
  const address = `${loppis.location.address.street}, ${loppis.location.address.city}`
  const dateString = `${format(loppis.dates[0].date, 'EEE d MMMM', { locale: sv })}, kl ${loppis.dates[0].startTime}-${loppis.dates[0].endTime}`
  const isLiked = likedLoppisIds?.includes(loppis._id)

  const likeLoppis = async (e) => {
    e.stopPropagation()
    if (!user || !token) {
      openLoginModal('Du måste vara inloggad för att gilla en loppis!')
      return
    }
    toggleLike(loppis._id, user.id, token)
  }

  const isMap = variant === 'map'
  const shownCats = isMap ? (loppis.categories ?? []).slice(0, 2) : (loppis.categories ?? [])

  return (

    <article className={`relative ${S.container[variant]}`}>
      {/* Bildcontainer */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3]">
        {IMG.card(id) ? (
          <img
            src={IMG.card(id)}
            srcSet={`${IMG.card(id)} 1x, ${IMG.card2x(id)} 2x`}
            alt={`${loppis.title} cover image`}
            className={`w-full h-full object-cover object-center rounded-2xl relative z-0`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Ingen bild
          </div>
        )}

        {/* X-knappen inuti bilden + högre z-index */}
        {isMap && onClose && (
          <button
            aria-label="Stäng"
            title="Stäng"
            onClick={(e) => { e.stopPropagation(); onClose?.() }}
            className="absolute top-2 right-2 z-20 rounded-full bg-white/90 hover:bg-white p-1.5 shadow"
          >
            <CircleX className="w-5 h-5" />
          </button>
        )}

        {isUpdating && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white/55 backdrop-blur-[1px]">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
      </div>

      {/* Body */}
      <div
        className={`flex flex-col flex-1 justify-between w-full ${isMap ? 'gap-1 p-2 sm:gap-2 sm:p-3' : 'gap-2 p-3'
          }`}
      >
        <div className="flex items-start justify-between gap-2">
          <Link to={`/loppis/${loppis._id}`}>
            <h3 className={`${S.title[variant]} text-black hover:underline underline-offset-2`}>
              {loppis.title}
            </h3>
          </Link>
          <LikeButton onLike={likeLoppis} isLiked={isLiked} />
        </div>

        <div className="flex flex-wrap gap-y-1">
          {shownCats.map((category, i) => <Tag key={i} text={category} />)}
          {isMap && loppis.categories?.length > 2 && (
            <span className="ml-1 text-xs text-zinc-500">+{loppis.categories.length - 2}</span>
          )}
        </div>

        <div className={isMap ? 'flex flex-col gap-1 text-xs' : 'flex flex-col gap-1'}>
          <Details icon={MapPinned} text={address} />
          <Details icon={Clock} text={dateString} />
        </div>
      </div>
    </article>
  )
}

export default LoppisCard
