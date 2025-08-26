import { useEffect, useState } from "react"
import { useMediaQuery } from 'react-responsive'
import { useSearchParams } from "react-router-dom"
import { Map, LocateFixed, List, Funnel, X } from "lucide-react"
import useGeoStore from '../stores/useGeoStore'
import SearchFilters from "../sections/SearchFilters"
import ListView from "../sections/ListView"
import MapView from "../sections/MapView"
import SearchBar from '../components/SearchBar'
import Button from "../components/Button"
import FilterTag from '../components/FilterTag'
import { getLoppisList } from '../services/loppisApi'
import { geocodeCity } from '../services/geocodingApi'

const Search = () => {
  // fetch states
  const [searchParams, setSearchParams] = useSearchParams() // get searchParams from React Router’s useSearchParams
  // derive query object directly from searchParams
  const query = {
    city: searchParams.get("city") || "",
    date: searchParams.get("date") || "all",
    categories: searchParams.getAll("category"),
  }
  const [cityInput, setCityInput] = useState(query.city)
  const [loppisList, setLoppisList] = useState([])

  // map states
  const [mapCenter, setMapCenter] = useState([59.3293, 18.0686]) // default Stockholm
  // Vem ska styra kartans center? 'city' eller 'user'
  const [centerBy, setCenterBy] = useState('city')
  // Geo store
  const location = useGeoStore(s => s.location)
  const geoStatus = useGeoStore(s => s.status)
  const geoError = useGeoStore(s => s.error)
  const requestLocation = useGeoStore(s => s.requestLocation)

  // layout states
  const [view, setView] = useState("map") //"map" or "list" for mobile, or "desktop"
  const [showFilters, setShowFilters] = useState(false) // hide search filters by default
  const isSmallMobile = useMediaQuery({ query: '(max-width: 480px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  // ux states
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // set layout when screen size changes
  useEffect(() => {
    if (isMobile) {
      // moblie - hide search filters and set view to map
      setShowFilters(false)
      setView('map')
    } else {
      // desktop - show search filters and set view to desktop
      setShowFilters(true)
      setView('desktop')
    }
  }, [isMobile])

  // fetch loppis list when searchParams change
  useEffect(() => {
    const fetchLoppisList = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getLoppisList(searchParams.toString())
        console.log('fetching with params: ', searchParams.toString())
        const results = data.data || []
        if (results.length === 0) {
          setError("Inga loppisar hittades för den här sökningen")
          setLoppisList([])
        }
        setLoppisList(results)
        console.log('Fetched loppis data: ', data.data)
      } catch (err) {
        console.error('Failed to fetch loppis data:', err)
        setError(err.message || 'Kunde inte hämta loppisdata')
        setLoppisList([])
      } finally {
        setLoading(false)
      }
    }
    fetchLoppisList()
  }, [searchParams])

  // ----- helpers to update searchParams and URL -----
  const updateCity = (city) => {
    const newParams = new URLSearchParams(searchParams)
    if (city) {
      newParams.set("city", city)
    } else {
      newParams.delete("city")
    }
    setSearchParams(newParams)
  }

  const updateDate = (dateId) => {
    const newParams = new URLSearchParams(searchParams)
    if (dateId && dateId !== "all") {
      newParams.set("date", dateId)
    } else {
      newParams.delete("date")
    }
    setSearchParams(newParams)
  }

  const addCategory = (category) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.append("category", category)
    setSearchParams(newParams)
  }

  const removeCategory = (category) => {
    const newParams = new URLSearchParams(searchParams)
    const remaining = newParams.getAll("category").filter((cat) => cat !== category)
    newParams.delete("category") // clear old categories
    remaining.forEach((cat) => newParams.append("category", cat)) // re-add remaining
    setSearchParams(newParams)
  }

  const resetFilters = () => {
    setSearchParams(new URLSearchParams())
    setCityInput('')
  }

  // helper to get date labels from id
  const getDateLabel = (id) => {
    const dateOptions = [
      { id: 'all', label: 'Visa alla' },
      { id: 'today', label: 'Idag' },
      { id: 'tomorrow', label: 'Imorgon' },
      { id: 'weekend', label: 'I helgen' },
      { id: 'next_week', label: 'Nästa vecka' },
    ]
    return dateOptions.find((opt) => opt.id === id)?.label || id
  }

  // update map center on map from query
  const updateMapCenter = async (city) => {
    try {
      setIsSearching(true)
      // if city is entered - fly to that location on map
      const { lat, lon } = await geocodeCity(city)
      setMapCenter([parseFloat(lat), parseFloat(lon)])        // triggers MapView.flyTo via props
      setCenterBy('city')
    } catch (err) {
      setError(err.message || "Kunde inte hitta platsen")
    } finally {
      setIsSearching(false)
    }
  }

  // useEffect to update map center from search params
  useEffect(() => {
    if (centerBy !== "city") return // respect user override

    if (query.city) {
      // geocode new city
      updateMapCenter(query.city.trim())
    } else {
      // reset to default (Stockholm)
      setMapCenter([59.3293, 18.0686])
    }
  }, [query.city, centerBy])

  // handle form search 
  const handleSearch = (e) => {
    e.preventDefault()
    updateCity(cityInput.trim())
    if (isMobile) {
      setShowFilters(false)
    }
  }

  // toggle view for mobile
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
    <main className='h-screen max-h-[calc(100vh-64px)]'>
      <div className='h-full relative lg:grid grid-cols-[2fr_6fr_4fr]'>

        {/* Search filters */}
        <aside className={`absolute lg:relative top-0 left-0 z-1050 h-full w-full max-w-sm p-4 bg-white border-r border-border shadow-sm transition-transform duration-400 ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}>
          {isMobile &&
            <X
              strokeWidth={3}
              onClick={toggleShowFilters}
              className='absolute right-5 cursor-pointer hover:text-accent'
            />
          }
          <SearchFilters
            cityInput={cityInput}
            setCityInput={setCityInput}
            onSearch={handleSearch} />
        </aside>

        {/* Active filters + toggle buttons */}
        <div className={`
          flex justify-between items-start py-2 gap-2 px-0.5 min-[340px]:px-2 sm:p-5 w-full
          ${!isMobile ?
            "absolute top-0 left-[320px] z-1050 max-w-[430px] xl:max-w-xl 2xl:max-w-3xl"
            : view === 'map' ? 'absolute z-1040' : 'relative z-static'}
          `}>
          {/* Left side: filters + optional search bar */}
          <div className='flex flex-col gap-2'>
            {/* show search field if filters not open */}
            {(isMobile && !showFilters) &&
              <form onSubmit={handleSearch}>
                <SearchBar
                  value={cityInput}
                  setValue={(e) => setCityInput(e.target.value)} />
              </form>
            }
            {/* Active filters */}
            <div className='flex gap-2 flex-wrap'>
              {query.city &&
                <FilterTag
                  text={query.city}
                  onClose={() => {
                    setCityInput('')
                    updateCity('')
                  }} />
              }
              {query.date !== "all" &&
                <FilterTag
                  text={getDateLabel(query.date)}
                  onClose={() => updateDate("all")} />
              }
              {query.categories.map((category) => (
                <FilterTag
                  key={category}
                  text={category}
                  onClose={() => removeCategory(category)}
                />
              ))}
              {/* reset filters button */}
              {(query.date !== "all" || query.categories.length > 0 || query.city) && (
                <FilterTag
                  text='Återställ filter'
                  onClose={() => resetFilters()}
                />
              )}
            </div>
          </div>

          {/* Right side: Toggle buttons */}
          <div className={`flex ${view === 'map' ? 'flex-col' : ''} items-end gap-1 sm:gap-2`}>
            {(!isMobile || view === 'map') &&
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
            }
            {isMobile && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Map */}
        {
          (view === 'map' || view === 'desktop') &&
          <MapView
            loppisList={loppisList}
            center={effectiveCenter}
            onRequestLocation={handleRequestLocation}
            hasUserLocation={!!location}
          />
        }

        {/* List */}
        {
          (view === 'list' || view === 'desktop') &&
            error ? (
            <div className="p-6 text-center text-gray-500">
              {error}
            </div>
          ) : (
            <ListView
              loppisList={loppisList}
            />
          )
        }

      </div >

    </main >
  )
}


export default Search
