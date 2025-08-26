import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import heroÌmage from '../assets/monstera.jpg'

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
      className='w-full bg-center bg-no-repeat bg-cover py-22 px-4 text-center'
      style={{ backgroundImage: `url(${heroÌmage})` }}>
      <h1 className='text-white text-3xl font-semibold mb-8'>Hitta en loppis nära dig</h1>
      <form
        className='w-full flex justify-center mt-6'
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