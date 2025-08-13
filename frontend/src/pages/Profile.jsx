
import { useState, useEffect } from "react"
import useAuthStore from "../stores/useAuthStore"
import LoppisList from "../components/LoppisList"

const Profile = ({ name }) => {

  const user = useAuthStore((s) => s.user)           // läs direkt från store
  const userId = user?._id ?? user?.id               // funkar oavsett id/_id

  const [loppisData, setLoppisData] = useState([])
  const [error, setError] = useState(null)
  const [emptyMsg, setEmptyMsg] = useState("")




  useEffect(() => {
    if (!userId) return


    const fetchUrl = new URL("http://localhost:8080/loppis/user")
    fetchUrl.searchParams.set("userId", String(userId))



    const fetchLoppisData = async () => {
      try {
        setError(null)
        setEmptyMsg("")

        const response = await fetch(fetchUrl)


        if (response.status === 404) {
          setLoppisData([])
          setEmptyMsg("Inga loppisar hittades för denna användare.")
          return
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.message || "Något gick fel vid hämtning av loppisdata.")
        }

        const data = await response.json()
        setLoppisData(Array.isArray(data.response) ? data.response : [])

      } catch (error) {
        setError(error.message || "Ett okänt fel inträffade.")
      }
    }
    fetchLoppisData()
  }, [userId])






  return (
    <section>
      <h2>Hello, {name}</h2>

      <h3>Mina Loppisar</h3>
      {error && <p className="text-red-500">{error}</p>}
      {!error && loppisData.length > 0 && (
        <LoppisList
          loppisData={loppisData}
          showEdit={false} // Om du vill visa redigeringsknapp, sätt till true
        //onEdit={(loppis) => ... öppna modal/route för edit här} 
        />
      )}
      {!error && loppisData.length === 0 && <p>{emptyMsg || "Du har inga loppisar än."}</p>}

      <h3>Mina Favoriter</h3>
      {/*Array av LoppisCard*/}
    </section>
  )
}


export default Profile