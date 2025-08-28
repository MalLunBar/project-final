import { useState, useEffect } from 'react'
import LoppisList from "../components/LoppisList"
import useAuthStore from "../stores/useAuthStore"
import useLikesStore from '../stores/useLikesStore'

const MyFavorites = () => {
  const { user, token } = useAuthStore()
  const { likedLoppisData, loadLikedLoppis } = useLikesStore()
  const [error, setError] = useState(null)
  const [emptyMsg, setEmptyMsg] = useState("")

  useEffect(() => {
    if (!user || !token) {
      setError("Du måste vara inloggad för att se dina favorit-loppisar.")
      return
    }
    loadLikedLoppis(user.id, token)
  }, [user])


  return (
    <section>
      <h2 className='sr-only'>Mina favoriter</h2>

      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-4">
        {!error && likedLoppisData?.length > 0 && (
          <LoppisList loppisList={likedLoppisData} variant="profile" />
        )}
        {!error && likedLoppisData?.length === 0 && (
          <p>{emptyMsg || "Du har inga loppisar än."}</p>
        )}
      </div>
    </section>
  )
}

export default MyFavorites