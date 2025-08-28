import { useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { CirclePlus, Gem, Heart } from 'lucide-react'
import useAuthStore from "../stores/useAuthStore"
import useModalStore from '../stores/useModalStore'
import MyFavorites from "../sections/MyFavorites"
import MyLoppis from "../sections/MyLoppis"
import CardLink from "../components/CardLink"
import Button from '../components/Button'
import ProfileLayout from '../components/ProfileLayout'
import bgDefault from "../assets/botanical-3.jpg"
import bgFav from "../assets/drawing.jpg"
import bgLoppis from "../assets/circle.jpg"
import defaultImg from "../assets/default-profile.png"


const Profile = () => {
  const { user, logout, token } = useAuthStore()
  const { tab } = useParams()
  const { openLoginModal } = useModalStore()
  const navigate = useNavigate()


  // 1) Konfiguration: tab → titel + render-funktion
  const tabs = useMemo(() => ({
    loppisar: {
      title: "Mina Loppisar",
      render: () => <MyLoppis />,
    },
    favoriter: {
      title: "Mina favoriter",
      render: () => <MyFavorites />,
    },
  }), [])

  const current = tab ? tabs[tab] : null

  const bgMap = {
    default: bgDefault,
    favoriter: bgFav,
    loppisar: bgLoppis,
  }

  const bgUrl = current ? (bgMap[tab] || bgMap.default) : bgMap.default

  // (valfritt) Uppdatera dokumenttitel när vy byts
  useEffect(() => {
    if (!current) return
    document.title = `${current.title} · Runt Hörnet`
  }, [current])


  // 2) Om tab finns → rendera “Rubrik + innehåll”
  if (current) {
    return (
      <ProfileLayout
        title={current.title}
        bgUrl={bgUrl}
        showBack
        onBack={() => navigate("/profile")}

      >
        {current.render()}
      </ProfileLayout>
    )
  }

  const handleLogout = () => {
    navigate('/')
    logout()
  }

  return (
    <ProfileLayout title={null} bgUrl={bgUrl}>
      <h1 className='font-bold text-2xl'>Profil</h1>

      <div className="flex items-center gap-6 md:gap-10 my-6">
        <img
          src={defaultImg}
          alt="Profilbild"
          className="w-16 h-16 rounded-full border border-gray-300 object-cover"
        />
        <p className="text-xl font-semibold">{user.firstName}</p>
      </div>

      <div className="flex items-center justify-end my-6 md:my-10">
        <Link
          to="/add"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-button text-button-text shadow hover:bg-button-hover hover:to-button-text-hover"
        >
          <CirclePlus className="w-4 h-4" />
          Lägg till loppis
        </Link>
      </div>

      <hr className="my-6 md:my-10 border-t border-gray-500" />

      
      <div 
        className="flex flex-col gap-8 md:gap-16" 
        aria-label="Profilval">
        <div className="mt-6 flex flex-wrap gap-4 md:gap-8 lg:gap-12 xl:gap-16">
        <CardLink to="/profile/loppisar" icon={Gem} label="Mina loppisar" />
        <CardLink to="/profile/favoriter" icon={Heart} label="Mina favoriter" />
        </div>

        <div className="flex flex-1 justify-end">
          <Button text="Logga ut" onClick={handleLogout} />
        </div>
      </div>
    </ProfileLayout>
  )
}

export default Profile