import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import heroImage from '../../assets/monstera.jpg'

const HeroSearch = () => {
  const [city, setCity] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!city.trim()) return
    navigate(`/search?city=${encodeURIComponent(city.trim())}`)
  }

  return (
    <section
      className='bg-center bg-no-repeat bg-cover py-22 sm:py-30 px-2 sm:px-4 text-center'
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <h1 className='mb-8 md:mb-14 text-white text-3xl sm:text-4xl md:text-5xl font-bold'>
        Hitta loppis nära dig
      </h1>
      <form
        className='flex justify-center mt-6 px-4'
        onSubmit={handleSearch}
      >
        <SearchBar value={city} setValue={(e) => setCity(e.target.value)} />
        {/* TODO: Visa loppisar nära mig */}
        {/* Knapp - Visa loppisar nära mig */}
        {/* Gör en current location fetch */}
        {/* Skicka koordinaterna till söksidan via queryparams */}
      </form>
    </section>
  )
}

export default HeroSearch