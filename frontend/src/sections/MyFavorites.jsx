import LoppisList from "../components/LoppisList"
import useAuthStore from "../stores/useAuthStore"
import useLikesStore from '../stores/useLikesStore'

const MyFavorites = () => {
  const { user } = useAuthStore()
  const { likedLoppisData } = useLikesStore()

  if (!user) {
    return (
      <section>
        <h2 className="sr-only">Mina favoriter</h2>
        <p className="text-red-500">Du måste vara inloggad för att se dina favorit-loppisar.</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="sr-only">Mina favoriter</h2>
      <div className="flex flex-col gap-4">
        {likedLoppisData?.length > 0 ? (
          <LoppisList loppisList={likedLoppisData} variant="profile" />
        ) : (
          <p>Du har inga loppisar än.</p>
        )}
      </div>
    </section>
  )
}

export default MyFavorites
