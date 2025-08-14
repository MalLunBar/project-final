import { useEffect, useState } from "react"
import { useMediaQuery } from 'react-responsive'
import { Map, List, Funnel, X } from "lucide-react"
import SearchFilters from "../sections/SearchFilters"
import ListView from "../sections/ListView"
import MapView from "../sections/MapView"
import Input from "../components/Input"
import Button from "../components/Button"
import FilterTag from '../components/FilterTag'

const Search = () => {
  const [view, setView] = useState("map") //"map" or "list" for mobile
  const [showFilters, setShowFilters] = useState(false)  //mobile: hide search filters by default
  const [loppisList, setLoppisList] = useState([])
  const [query, setQuery] = useState({
    address: "",
    dates: { id: "all", label: "Visa alla" },
    categories: [],
  })

  const [mapCenter, setMapCenter] = useState([59.3293, 18.0686]) // default Stockholm
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)

  const isSmallMobile = useMediaQuery({ query: '(max-width: 480px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const isLaptop = useMediaQuery({ query: '(max-width: 1279px)' })

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

  // toggle view 
  const toggleView = () => {
    if (view === 'map') {
      setView('list')
    } else {
      setView('map')
    }
  }

  // toogle show filters 
  const toggleShowFilters = () => {
    setShowFilters(prev => !prev)
  }

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
    setShowFilters(false)
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
      {/* TODO: Ändra till "remaining height" */}

      {/* TODO: add "Nära mig" or "min position" button to search nearby*/}

      {isMobile ? (
        // Mobile: toggle between map and list view
        <>
          <div className='absolute w-full py-2 px-0.5 min-[340px]:px-2 sm:p-5 z-1200'>
            <div div className='flex flex-col gap-2'>
              <div className='flex justify-between gap-2'>
                <Button
                  type='button'
                  text={isSmallMobile ? '' : 'Sökfilter'}
                  icon={Funnel}
                  active={true}
                  ariaLabel='Visa sökfilter'
                  onClick={toggleShowFilters}
                />
                {/* show search field if filters not open */}
                {/* TODO: Add a magnifying icon in search field*/}
                {!showFilters &&
                  <form onSubmit={handleSearch}>
                    <Input
                      label='Område'
                      type='text'
                      value={query.address}
                      onChange={(e) => setQuery(prev => ({ ...prev, address: e.target.value }))}
                      showLabel={false}
                      required={false}
                      placeholder='Sök område...'
                    />
                  </form>
                }
                <Button
                  type='button'
                  text={isSmallMobile ? '' : (view === 'map' ? 'Lista' : 'Karta')}
                  icon={view === 'map' ? List : Map}
                  active={true}
                  ariaLabel={view === 'map' ? 'Visa loppisar i lista' : 'Visa loppisar på karta'}
                  onClick={toggleView}
                />
              </div>

              {/* Display selected filters */}
              <div className='flex gap-2 flex-wrap'>
                {query.dates.id !== "all"
                  ? <FilterTag
                    text={query.dates.label}
                    onClose={() => setQuery(prev => ({ ...prev, dates: { id: "all", label: "Visa alla" } }))} />
                  : <></>
                }
                {query.categories?.map((category) => {
                  return (
                    <FilterTag
                      key={`filter-${category}`}
                      text={category}
                      onClose={() => setQuery((prev => ({ ...prev, categories: prev.categories.filter((cat) => cat !== category) })))} />)
                })}
              </div>
            </div>

            {showFilters &&
              <aside className={`fixed inset-0 z-1050 w-full max-w-sm h-full px-4 py-22 bg-white border-r border-border shadow-sm transition-transform duration-400 ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}>
                <X strokeWidth={3} onClick={toggleShowFilters} className='absolute right-5 hover:text-accent' />
                <SearchFilters query={query} setQuery={setQuery} onSearch={handleSearch} />
              </aside>
            }

          </div>

          {/* conditionally render map or list view */}
          {view === 'map' && <MapView loppisList={loppisList} center={mapCenter} />}
          {view === 'list' && <ListView loppisList={loppisList} />}

          {/* optional - toggle updates URL: /search?view=map */}

        </>
      ) : (
        // Desktop: views side-by-side
        <div className='grid h-full grid-cols-[2fr_6fr_4fr]'>
          <aside className='h-full p-4 bg-white border-r border-border shadow-sm'>
            <SearchFilters query={query} setQuery={setQuery} onSearch={handleSearch} />
          </aside>
          <MapView loppisList={loppisList} center={mapCenter} />
          <ListView loppisList={loppisList} />
        </div>
      )}





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