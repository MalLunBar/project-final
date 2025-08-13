import { use } from "react"
import { useState, useEffect } from "react"

const Profile = ({ name }) => {

  const [loppisData, setLoppisData] = useState([])
  const [error, setError] = useState(null)
  const [emptyMsg, setEmptyMsg] = useState("")

  // Hämta userId – antingen via prop eller (tillfälligt) localStorage
  const userId = userIdProp || localStorage.getItem("userId")

  useEffect(() => {
    if (!userId) {
      setError("Ingen användare inloggad (userID saknas).")
      return
    }

    const controller = new AbortController()
    const fetchUrl = 'http://localhost:8080/loppis/user'
    fetchUrl.searchParams.set('userId', userId)


    const fetchLoppisData = async () => {
      try {
        const response = await fetch(fetchUrl)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json();
        return data.response; // Assuming the response structure
      } catch (error) {
        console.error('Failed to fetch loppis data:', error);
        return [];
      }
    }

  })





  return (
    <section>
      <h2>Hello, {name}</h2>
      <h3>Mina Loppisar</h3>
      {/*Array av LoppisCard sen*/}

      <h3>Mina Favoriter</h3>
      {/*Array av LoppisCard*/}
    </section>
  )
}

export default Profile