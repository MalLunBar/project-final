import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'
import HeroSearch from '../sections/HeroSearch'
import PopularCarousel from '../sections/PopularCarousel'
import CategoryGrid from '../sections/CategoryGrid'

const Home = () => {
  const { user } = useAuthStore()
  const { openLoginModal } = useModalStore()
  const navigate = useNavigate()


  // TODO: fetch upcoming loppis
  const upcomingExamples = [
    { id: 1, title: "Stor Sommarloppis", date: "Lör 24 Aug", city: "Stockholm" },
    { id: 2, title: "Vintage Loppis", date: "Sön 25 Aug", city: "Göteborg" },
  ]

  const handleAdd = () => {
    if (!user) {
      openLoginModal('Du måste vara inloggad för att lägga till en loppis!')
      return
    }
    navigate("/add")
  }

  return (
    <main className='flex flex-col items-center w-full gap-4'>

      {/* Hero section with search bar → quick entry point to search*/}
      <HeroSearch />

      {/* Carousel section with popular loppis*/}
      <PopularCarousel />

      {/* Categories grid quick links → leads to filtered search */}
      <CategoryGrid />

      {/* Upcoming Loppis */}
      <section className="w-full max-w-3xl mt-10 px-4 sm:px-8">
        <h2 className="text-xl font-semibold mb-4">Kommande loppisar</h2>
        <div className="space-y-3">
          {upcomingExamples.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-white rounded-2xl shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  {event.date} • {event.city}
                </p>
              </div>
              <button
                onClick={() => navigate(`/loppis/${event.id}`)}
                className="text-accent font-semibold cursor-pointer"
              >
                Visa →
              </button>
            </div>
          ))}
        </div>
      </section>


      {/* CTA - Add your own loppis */}
      <section className="w-full max-w-xl mt-14 bg-light p-10 rounded-2xl text-center shadow-lg">
        <h2 className="text-2xl font-semibold mb-3">Har du saker att sälja?</h2>
        <p className="mb-6">Lägg upp din egen loppis och nå ut till fler loppisälskare!</p>
        <button
          onClick={() => handleAdd()}
          className="bg-white text-accent font-semibold py-3 px-6 rounded-full shadow cursor-pointer hover:bg-gray-100 transition"
        >
          Skapa Loppis
        </button>
      </section>


    </main>
  )
}

export default Home
