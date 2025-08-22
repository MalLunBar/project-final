import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { Baby, Lamp, Flower2, Shirt, Sofa, Book, Cat, Tv, CookingPot, Shapes } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import CardLink from '../components/CardLink'
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'
import HeroSearch from '../sections/HeroSearch'


const Home = () => {
  const { user, logout } = useAuthStore()
  const { openLoginModal } = useModalStore()
  const navigate = useNavigate()

  // TODO: fetch categories from api?
  const categories = [
    { id: 'vintage', label: "Vintage", icon: Lamp },
    { id: 'children', label: "Barn", icon: Baby },
    { id: 'garden', label: "Trädgård", icon: Flower2 },
    { id: 'clothes', label: "Kläder", icon: Shirt },
    { id: 'furniture', label: "Möbler", icon: Sofa },
    { id: 'books', label: "Böcker", icon: Book },
    { id: 'pets', label: "Husdjur", icon: Cat },
    { id: 'electronics', label: "Elektronik", icon: Tv },
    { id: 'kitchen', label: "Kök", icon: CookingPot },
    { id: 'other', label: "Blandat", icon: Shapes }
  ]

  // TODO: fetch popular loppis
  const loppisExamples = [
    { id: 1, title: "Vintage Clothes Market", img: "/images/loppis1.jpg" },
    { id: 2, title: "Book Fair", img: "/images/loppis2.jpg" },
    { id: 3, title: "Antique Furniture Sale", img: "/images/loppis3.jpg" },
  ]

  // för test
  const upcomingExamples = [
    { id: 1, title: "Stor Sommarloppis", date: "Lör 24 Aug", city: "Stockholm" },
    { id: 2, title: "Vintage Loppis", date: "Sön 25 Aug", city: "Göteborg" },
  ]

  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 15 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 20 },
      },
    },
    autoplay: {
      delay: 3000,
    },
  })

  const handleAdd = () => {
    if (!user) {
      openLoginModal('Du måste vara inloggad för att lägga till en loppis!')
      return
    }
    navigate("/add")
  }

  return (
    <main className='flex flex-col items-center w-full gap-4'>

      {/* Hero section */}
      <HeroSearch />

      {/* Carousel section */}
      {/* popular / near / upcoming */}
      <section className="w-full max-w-3xl mt-10 px-4">
        <h2 className="text-xl font-semibold mb-4">Populära Loppisar</h2>
        <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden">
          {loppisExamples.map((l) => (
            <div
              key={l.id}
              className="keen-slider__slide flex flex-col items-center justify-center bg-gray-100"
            >
              <img src={l.img} alt={l.title} className="w-full h-50 object-cover" />
              <p className="p-4 font-medium">{l.title}</p>
            </div>
          ))}
        </div>
        {/* TODO: lägg till pilar? */}
        {/* TODO: ändra till loppisCard */}
      </section>



      {/* Categories grid */}
      <section className="w-full max-w-3xl mt-10 px-4">
        <h2 className="text-xl font-semibold mb-4">Sök efter kategori</h2>

        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {categories.map(cat =>
            <CardLink
              key={cat.id}
              icon={cat.icon}
              label={cat.label}
              to={`/search?category=${cat.id}`}
              className='hover:bg-hover hover:shadow-md'
            />)}
          {/* TODO: ändra bakgrundsfärg på korten? */}

        </div>
      </section>

      {/* Upcoming Loppis */}
      <section className="w-full max-w-3xl mt-10 px-4">
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
      <section className="w-full max-w-xl mt-10 bg-light p-10 rounded-2xl text-center shadow-lg">
        <h2 className="text-2xl font-semibold mb-3">Har du saker att sälja?</h2>
        <p className="mb-6">Lägg upp din egen loppis och nå ut till fler loppisälskare!</p>
        <button
          onClick={() => handleAdd()}
          className="bg-white text-accent font-semibold py-3 px-6 rounded-full shadow cursor-pointer hover:bg-gray-100 transition"
        >
          Skapa Loppis
        </button>
      </section>






      {/* test av logga in funktion - TA BORT NÄR DET FINNS LOGGA UT KNAPP NÅGON ANNANSTANS */}
      <section className='mt-20 flex items-center gap-2'>
        {user ? (
          <>
            <h2>Välkommen, {user.firstName}!</h2>
            <Button
              text='Logga ut'
              onClick={logout}
            />
          </>
        ) : (
          <>
            <h2>Välkommen!</h2>
            <Button
              text='Logga in'
              onClick={() => openLoginModal()}
            />
          </>
        )}
      </section>


    </main>
  )
}

export default Home
