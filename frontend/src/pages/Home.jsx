import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'
import HeroSearch from '../sections/HeroSearch'
import Divider from '../components/Divider'
import PopularCarousel from '../sections/PopularCarousel'
import CategoryGrid from '../sections/CategoryGrid'
import Upcoming from '../sections/Upcoming'

const Home = () => {
  const { user } = useAuthStore()
  const { openLoginModal } = useModalStore()

  const handleAdd = () => {
    if (!user) {
      openLoginModal('Du måste vara inloggad för att lägga till en loppis!')
      return
    }
    navigate("/add")
  }

  return (
    <main className='min-h-screen bg-gradient-to-b bg-[#f5efe5]'>
      {/* Hero section with search bar → quick entry point to search*/}
      <HeroSearch />
      {/* Carousel section with popular loppis*/}
      <PopularCarousel />
      <Divider />
      {/* Categories grid quick links → leads to filtered search */}
      <CategoryGrid />
      <Divider />
      {/* Upcoming Loppisar*/}
      <Upcoming />
      <Divider />
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
