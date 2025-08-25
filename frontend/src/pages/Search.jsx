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
    setShowFilters(false)
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
        {/* TODO: ändra grid fractions för laptop/desktop */}

        {/* Mobile control panel */}
        {isMobile && (
          <div className={`${view === 'map' ? 'absolute z-1050' : 'relative z-static'} w-full py-2 px-0.5 min-[340px]:px-2 sm:p-5 `}>
            <div div className='flex justify-between items-start gap-2'>
              {/* Search bar and active filters */}
              <div className='flex flex-col gap-2'>

                {/* show search field if filters not open */}
                {!showFilters &&
                  <form onSubmit={handleSearch}>
                    <SearchBar
                      value={cityInput}
                      setValue={(e) => setCityInput(e.target.value)} />
                  </form>
                }
                {/* Active filters */}
                <div className='flex gap-2 flex-wrap'>
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
                </div>
              </div>

              {/* Toggle buttons */}
              <div className={`flex ${view === 'map' ? 'flex-col' : ''} items-end gap-1 sm:gap-2`}>
                {view === 'map' &&
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
          </div>
        )}

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

        {/* Map */}
        {(view === 'map' || view === 'desktop') &&
          <MapView
            loppisList={loppisList}
            center={effectiveCenter}
            onRequestLocation={handleRequestLocation}
            hasUserLocation={!!location}

          />
        }

        {/* List */}
        {(view === 'list' || view === 'desktop') &&
          <ListView
            loppisList={loppisList}
          />
        }

      </div>


      {/* TODO: add "Nära mig" or "min position" button to search nearby*/}



      {/* OLD LAYOUT - REMOVE WHEN NEW IS FINISHED */}
      {/* {isMobile ? (
        // Mobile: toggle between map and list view
        <>
          <div className={`${view === 'map' ? 'absolute z-1050' : 'relative z-auto'} w-full py-2 px-0.5 min-[340px]:px-2 sm:p-5 `}>
            <div div className='flex flex-col gap-2'>
              <div className='flex justify-between gap-2'>

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
      )} */}


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
