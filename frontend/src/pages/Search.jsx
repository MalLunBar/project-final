
import { useEffect, useState } from "react"
import Input from "../components/Input"
import LoppisList from "../components/LoppisList"
import MapView from "../sections/MapView"

const Search = () => {
  const [loppisList, setLoppisList] = useState([])
  const [query, setQuery] = useState("")           // the input value
  const [mapCenter, setMapCenter] = useState([59.3293, 18.0686]) // default Stockholm
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)

  const fetchUrl = 'http://localhost:8080/loppis'

  useEffect(() => {
    // Simulate fetching loppis data
    const fetchLoppisData = async () => {
      try {
        const response = await fetch(fetchUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch loppis data')
        }
        const data = await response.json()
        setLoppisList(data.response.data)
        console.log(data.response.data)

      } catch (error) {
        console.error('Error fetching loppis data:', error)
      } finally {
        console.log('Loppis data fetched successfully')
        //här kan vi ha loading set to false 
      }
    }
    fetchLoppisData()
  }, [])



  // Now calls your backend, not Nominatim directly
  const geocodeCity = async (text) => {
    const res = await fetch(`http://localhost:8080/api/geocode?q=${encodeURIComponent(text)}`)
    if (!res.ok) throw new Error("Geocoding failed")
    const results = await res.json()
    if (!results || results.length === 0) throw new Error("Inga träffar")
    const { lat, lon } = results[0]
    return [parseFloat(lat), parseFloat(lon)]
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setError(null)
    try {
      const center = await geocodeCity(query.trim())
      setMapCenter(center)        // triggers MapView.flyTo via props
    } catch (err) {
      setError(err.message || "Kunde inte hitta platsen")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <section>
      <div>
        <h2>Hitta en loppis</h2>


        <form onSubmit={onSubmit}>
          <Input
            label='Sök stad/ort'
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex. Stockholm, Uppsala, Lund…"
          />
        </form>

        {isSearching && <p>Söker…</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>

      <MapView center={mapCenter} />

      <div>

        {/* Antalet loppisar på den sökningen? */}
        {/* {loppisList.length > 0 ? (
          <LoppisList loppisList={loppisList} />
        ) : (
          <p>Inga loppisar hittades</p>
        )} */}

        <LoppisList loppisList={loppisList} />


      </div>
    </section>
  )
}


export default Search