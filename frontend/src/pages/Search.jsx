import { useEffect, useState } from "react"
import { useMediaQuery } from 'react-responsive'
import { Map, List } from "lucide-react"
import SearchFilters from "../sections/SearchFilters"
import ListView from "../sections/ListView"
import MapView from "../sections/MapView"
import Input from "../components/Input"
import Button from "../components/Button"

const Search = () => {
  const [view, setView] = useState("map") // "map" or "list" for mobile

  const [loppisList, setLoppisList] = useState([])
  // const [query, setQuery] = useState("")           // the input value
  const [query, setQuery] = useState({
    address: "",
    dates: "all",
    categories: [],
  })

  const [mapCenter, setMapCenter] = useState([59.3293, 18.0686]) // default Stockholm
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  const fetchUrl = 'http://localhost:8080/loppis'

  // fetch loppis data 
  useEffect(() => {
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

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.address.trim()) return

    setIsSearching(true)
    setError(null)
    try {
      const center = await geocodeCity(query.address.trim())
      setMapCenter(center)        // triggers MapView.flyTo via props
    } catch (err) {
      setError(err.message || "Kunde inte hitta platsen")
    } finally {
      setIsSearching(false)
    }
  }


  return (
    <main className='h-screen'>

      {/* Search input */}
      {/* Search Filters */}

      {isMobile ? (
        // Mobile: toggle between map and list view
        <>
          {/* conditional rendering */}
          {view === 'map' &&
            <>
              {/* toggle button */}
              <Button
                type='button'
                text='Lista'
                icon={List}
                active={view === "map" ? true : false}
                ariaLabel='Visa loppisar i lista'
                onClick={() => setView("list")}
              />
              {/* Show map view */}
              <MapView loppisList={loppisList} center={mapCenter} />
            </>
          }
          {view === 'list' && <>
            {/* toggle button */}
            <Button
              type='button'
              text='Karta'
              icon={Map}
              active={view === "list" ? true : false}
              ariaLabel='Visa loppisar på karta'
              onClick={() => setView("map")}
            />
            {/* Show list view */}
            <ListView loppisList={loppisList} />
          </>
          }

          {/* optional - toggle updates URL: /search?view=map */}

        </>
      ) : (
        // Desktop: show both views side-by-side
        <div className='grid h-full grid-cols-[2fr_6fr_4fr]'>
          <SearchFilters query={query} setQuery={setQuery} onSearch={handleSearch} />
          <MapView loppisList={loppisList} center={mapCenter} />
          <ListView loppisList={loppisList} />
        </div>
      )}


      {/* <form onSubmit={onSubmit}>
        <Input
          label='Sök stad/ort'
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex. Stockholm, Uppsala, Lund…"
        />
      </form>
      {isSearching && <p>Söker…</p>}
      {error && <p className="text-red-600">{error}</p>} */}



      {/* Antalet loppisar på den sökningen? */}
      {/* {loppisList.length > 0 ? (
          <LoppisList loppisList={loppisList} />
        ) : (
          <p>Inga loppisar hittades</p>
        )} */}


    </main>
  )
}


export default Search