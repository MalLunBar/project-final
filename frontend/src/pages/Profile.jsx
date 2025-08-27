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
      <div className="flex items-center gap-4 mt-4">
        <img
          src="default-profile.png"
          alt="Profilbild"
          className="w-16 h-16 rounded-full border border-gray-300 object-cover"
        />
        <p className="text-2xl font-bold">{user.firstName}</p>
      </div>

      <div className="flex items-center justify-end mt-4 mb-6">
        <Link
          to="/add"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-button text-button-text shadow hover:bg-button-hover hover:to-button-text-hover"
        >
          <CirclePlus className="w-4 h-4" />
          Lägg till loppis
        </Link>
      </div>

      <hr className="my-6 border-t border-gray-500" />

      <section className="mt-6 flex flex-wrap gap-4" aria-label="Profilval">
        <CardLink to="/profile/loppisar" icon={Gem} label="Mina loppisar" />
        <CardLink to="/profile/favoriter" icon={Heart} label="Mina favoriter" />
        <div className="flex flex-1 justify-end">
          <Button text="Logga ut" onClick={handleLogout} />
        </div>
      </section>
    </ProfileLayout>
  )
}

export default Profile