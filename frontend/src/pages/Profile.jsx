import { useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { CirclePlus, Gem, Heart, Settings as SettingsIcon, ChevronLeft } from 'lucide-react'
import useAuthStore from "../stores/useAuthStore"
import MyFavorites from "../sections/MyFavorites"
import MyLoppis from "../sections/MyLoppis"
import CardLink from "../components/CardLink"


const SettingsSection = () => {
  return (
    <section className="mt-2">
      <p className="text-sm text-gray-600">
        Här kan du lägga in dina profilinställningar senare (namn, bild, notiser, mm).
      </p>
    </section>
  )
}


const Profile = () => {
  const { user, token } = useAuthStore()
  const { tab } = useParams()
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
    settings: {
      title: "Settings",
      render: () => <SettingsSection />,
    },
  }), [])

  const current = tab ? tabs[tab] : null

  // (valfritt) Uppdatera dokumenttitel när vy byts
  useEffect(() => {
    if (!current) return
    document.title = `${current.title} · Runt Hörnet`
  }, [current])

  // 2) Om tab finns → rendera “Rubrik + innehåll”
  if (current) {
    return (
      <main className="p-4">
        <button
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-1 text-sm mb-4 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Till profil
        </button>

        <h1 className="text-2xl font-bold">{current.title}</h1>
        <hr className="mt-3 mb-4 border-gray-200" />

        {current.render()}
      </main>
    )
  }

  return (
    <main className="bg-[url(./lines.jpg)] bg-center bg-no-repeat bg-cover bg-white/0 bg-blend-screen min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img
          src={user.profilePicture || "default-profile.png"}
          alt="Profilbild"
          className="w-16 h-16 rounded-full border border-gray-300 object-cover"
        />
        <p className="text-2xl font-bold">{user.firstName}</p>
      </div>
      {/* Quick action */}
      <div className='flex items-center justify-end mt-4 mb-6'>
        <Link
          to="/add"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-orange-500 text-white shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <CirclePlus className="w-4 h-4" />
          Lägg till loppis
        </Link>
      </div>

      {/* Divider */}
      <hr className="my-6 border-t border-gray-500" />


      {/* Buttons */}
      <section
        className="mt-6 flex flex-wrap gap-4"
        aria-label="Profilval"
      >
        <CardLink
          to="/profile/loppisar"
          icon={Gem}
          label="Mina loppisar"
        />
        <CardLink
          to="/profile/favoriter"
          icon={Heart}
          label="Mina favoriter" />
        <CardLink
          to="/profile/settings"
          icon={SettingsIcon}
          label="Settings"
          className="basis-full"
        />
      </section>
    </main>
  )
}


export default Profile