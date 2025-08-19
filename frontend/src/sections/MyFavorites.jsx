import { useState, useEffect } from 'react'
import LoppisList from "../components/LoppisList"
import useAuthStore from "../stores/useAuthStore"

const MyFavorites = () => {
  const { user, token } = useAuthStore()
  const [loppisList, setLoppisList] = useState([])
  const [error, setError] = useState(null)
  const [emptyMsg, setEmptyMsg] = useState("")

  useEffect(() => {
    if (!user || !token) {
      setError("Du måste vara inloggad för att se dina favorit-loppisar.")
      return
    }

    const fetchUrl = new URL("http://localhost:8080/loppis/user/liked")

    const fetchloppisList = async () => {
      try {
        setError(null)
        setEmptyMsg("")

        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: { 'Authorization': token }
        })

        if (response.status === 404) {
          setLoppisList([])
          setEmptyMsg("Inga gillade loppisar hittades för denna användare.")
          return
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.message || "Något gick fel vid hämtning av loppisList.")
        }

        const data = await response.json()
        setLoppisList(Array.isArray(data.response.data) ? data.response.data : [])
        if (data.response.data.length === 0) {
          setEmptyMsg("Du har inte gillat några loppisar än.")
        }

      } catch (error) {
        setError(error.message || "Ett okänt fel inträffade.")
      }
    }
    fetchloppisList()
  }, [user])

  return (
    <section>
      <h3>Mina Favoriter</h3>
      {error && <p className="text-red-500">{error}</p>}
      {!error && loppisList?.length > 0 && (
        <LoppisList
          loppisList={loppisList}
          variant="search"
        />
      )}
      {!error && loppisList?.length === 0 && <p>{emptyMsg || "Du har inga loppisar än."}</p>}
    </section>
  )
}

export default MyFavorites