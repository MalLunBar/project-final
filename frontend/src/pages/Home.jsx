import HeroSearch from '../sections/HeroSearch'
import Divider from '../components/Divider'
import PopularCarousel from '../sections/PopularCarousel'
import CategoryGrid from '../sections/CategoryGrid'
import Upcoming from '../sections/Upcoming'
import CtaHome from '../sections/CtaHome'
import Footer from '../sections/Footer'

const Home = () => {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className='min-h-[calc(100dvh-var(--nav-height))] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-gradient-to-b bg-[#f5efe5]'>
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
      <CtaHome />
      <Footer footerText={`© ${new Date().getFullYear()} Runt hörnet`} />
    </main>
  )
}

export default Home
