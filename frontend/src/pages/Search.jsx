import { useEffect, useState } from "react"
import { useMediaQuery } from 'react-responsive'
import { Map, LocateFixed, List, Funnel, X } from "lucide-react"
import useGeoStore from '../stores/useGeoStore'
import SearchFilters from "../sections/SearchFilters"
import ListView from "../sections/ListView"
import MapView from "../sections/MapView"
import Input from "../components/Input"
import Button from "../components/Button"
import FilterTag from '../components/FilterTag'
import useAuthStore from "../stores/useAuthStore"
import { getLoppisList } from '../services/loppisApi'
import { geocodeCity } from '../services/geocodingApi'

const Search = () => {
  const { user, token } = useAuthStore()
  const [view, setView] = useState("map") //"map" or "list" for mobile
  const [showFilters, setShowFilters] = useState(false)  //mobile: hide search filters by default
  const [loppisList, setLoppisList] = useState([])
  const [query, setQuery] = useState({
    city: "",
    dates: { id: "all", label: "Visa alla" },
    categories: [],
  })
  const [searchParams, setSearchParams] = useState()

  const [mapCenter, setMapCenter] = useState([59.3293, 18.0686]) // default Stockholm
  // Vem ska styra kartans center? 'city' eller 'user'
  const [centerBy, setCenterBy] = useState('city')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const isSmallMobile = useMediaQuery({ query: '(max-width: 480px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const isLaptop = useMediaQuery({ query: '(max-width: 1279px)' })


  // Geo store
  const location = useGeoStore(s => s.location)
  const geoStatus = useGeoStore(s => s.status)
  const geoError = useGeoStore(s => s.error)
  const requestLocation = useGeoStore(s => s.requestLocation)

  // fetch loppis list on initial laod or when searchParams change
  useEffect(() => {
    const fetchLoppisList = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getLoppisList(searchParams)
        setLoppisList(data.data || [])
        console.log('Fetched loppis data: ', data.data)
      } catch (err) {
        // --------------------TODO: handle error appropriately
        console.error('Failed to fetch loppis data:', err)
        setError(err.message || 'Kunde inte hämta loppisdata')
      } finally {
        setLoading(false)
      }
    }
    fetchLoppisList()
  }, [searchParams])

  // search 
  const handleSearch = async (e) => {
    e.preventDefault()
    setShowFilters(false)
    setIsSearching(true)
    setError(null)
    // update searchParams from query
    const params = new URLSearchParams()
    if (query.city) {
      params.append('city', query.city)
    }
    if (query.dates.id !== 'all') {
      params.append('date', query.dates.id)
    }
    query.categories.forEach(cat => params.append('category', cat))
    setSearchParams(params.toString())
    try {
      // if city is entered - fly to that location on map
      if (!query.city.trim()) return
      const { lat, lon } = await geocodeCity(query.city.trim())
      setMapCenter([parseFloat(lat), parseFloat(lon)])        // triggers MapView.flyTo via props
      setCenterBy('city')
    } catch (err) {
      setError(err.message || "Kunde inte hitta platsen")
    } finally {
      setIsSearching(false)
    }
  }

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

  // Ett “effektivt” center som beror på centerBy
  const effectiveCenter =
    centerBy === 'user' && location
      ? [location.lat, location.lng]
      : mapCenter

  // När MapView (eller kartans flytande ikon) vill hämta plats:
  const handleRequestLocation = async () => {
    await requestLocation()
    setCenterBy('user') // börja styra av användarens position
  }


  return (
    <main className='h-screen'>
      {/* TODO: Ändra till "remaining height" */}

      {/* TODO: add "Nära mig" or "min position" button to search nearby*/}

      {isMobile ? (
        // Mobile: toggle between map and list view
        <>
          <div className={`${view === 'map' ? 'absolute z-1050' : 'relative z-auto'} w-full py-2 px-0.5 min-[340px]:px-2 sm:p-5 `}>
            <div div className='flex flex-col gap-2'>
              <div className='flex justify-between gap-2'>

                {/* show search field if filters not open */}
                {/* TODO: Add a magnifying icon in search field*/}
                {!showFilters &&
                  <form onSubmit={handleSearch}>
                    <Input
                      label='Område'
                      type='text'
                      value={query.city}
                      onChange={(e) => setQuery(prev => ({ ...prev, city: e.target.value }))}
                      showLabel={false}
                      required={false}
                      placeholder='Sök område...'
                    />
                  </form>
                }
                <div className='flex flex-col items-center gap-1 mr-2'>
                  <Button
                    type="button"
                    text={
                      isSmallMobile
                        ? ''
                        : geoStatus === 'requesting'
                          ? 'Hämtar…'
                          : 'Min plats'
                    }
                    icon={LocateFixed}
                    active={true}
                    ariaLabel="Använd min plats"
                    disabled={geoStatus === 'requesting'}
                    onClick={handleRequestLocation}
                  />
                  <Button
                    type='button'
                    text={isSmallMobile ? '' : 'Sökfilter'}
                    icon={Funnel}
                    active={true}
                    ariaLabel='Visa sökfilter'
                    onClick={toggleShowFilters}
                  />
                  <Button
                    type='button'
                    text={isSmallMobile ? '' : (view === 'map' ? 'Lista' : 'Karta')}
                    icon={view === 'map' ? List : Map}
                    active={true}
                    ariaLabel={view === 'map' ? 'Visa loppisar i lista' : 'Visa loppisar på karta'}
                    onClick={toggleView}
                  />
                </div>
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
              <aside className={`fixed top-0 left-0 z-1050 w-full max-w-sm h-full px-4 py-22 bg-white border-r border-border shadow-sm transition-transform duration-400 ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}>
                <X
                  strokeWidth={3}
                  onClick={toggleShowFilters}
                  className='absolute right-5 hover:text-accent'
                />
                <SearchFilters
                  query={query}
                  setQuery={setQuery}
                  onSearch={handleSearch}
                />
              </aside>
            }

          </div>

          {/* conditionally render map or list view */}
          {view === 'map' &&
            <MapView
              loppisList={loppisList}
              center={effectiveCenter}
              onRequestLocation={handleRequestLocation}
              hasUserLocation={!!location}

            />}
          {view === 'list' &&
            <ListView
              loppisList={loppisList}
            />}

          {/* optional - toggle updates URL: /search?view=map */}

        </>
      ) : (
        // Desktop: views side-by-side
        <div className='grid h-full grid-cols-[2fr_6fr_4fr]'>
          <aside className='h-full p-4 bg-white border-r border-border shadow-sm'>
            <div>
              <Button
                type="button"
                text={geoStatus === 'requesting' ? 'Hämtar…' : 'Använd min plats'}
                icon={LocateFixed}
                active={true}
                ariaLabel="Använd min plats"
                disabled={geoStatus === 'requesting'}
                onClick={handleRequestLocation}
              />
            </div>
            <SearchFilters
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch} />
          </aside>
          <MapView
            loppisList={loppisList}
            center={effectiveCenter}
            onRequestLocation={handleRequestLocation}
            hasUserLocation={!!location}
          />
          <ListView
            loppisList={loppisList}
          />
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