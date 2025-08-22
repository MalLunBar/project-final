import { useState, useEffect } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { ChevronLeft, ChevronRight } from "lucide-react"
import CarouselCard from '../components/CarouselCard'
import { getPopularLoppis } from '../services/loppisApi'

const PopularCarousel = () => {
  const [loppisList, setLoppisList] = useState([])

  // TODO: fetch popular loppis
  useEffect(() => {
    const fetchloppisList = async () => {
      // setLoading(true)
      // setError(null)
      // setEmptyMsg("")
      try {
        const data = await getPopularLoppis()
        setLoppisList(data)
      } catch (err) {
        // --------------------TODO: handle error appropriately
        console.error('Failed to fetch loppis data:', err)
        // setError(err.message || 'Kunde inte hämta loppisdata')
      } finally {
        // setLoading(false)
      }
    }

    fetchloppisList()
  }, [])

  const [sliderRef, slider] = useKeenSlider({
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

  return (
    <section className="w-full max-w-3xl mt-10 px-4 sm:px-8">
      <h2 className="text-xl font-semibold mb-4">Populära Loppisar</h2>
      <div className="relative w-full ">
        {/* slider */}
        <div ref={sliderRef} className="keen-slider overflow-hidden py-1">
          {loppisList.map(loppis => <CarouselCard key={loppis._id} loppis={loppis} />
          )}
        </div>
        {/* left arrow */}
        <button
          onClick={() => slider.current?.prev()}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow cursor-pointer hover:bg-white transition-opacity duration-200"
        >
          <ChevronLeft size={24} strokeWidth={2} className="text-accent" />
        </button>
        {/* right arrow */}
        <button
          onClick={() => slider.current?.next()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow cursor-pointer hover:bg-white transition-opacity duration-200"
        >
          <ChevronRight size={24} strokeWidth={2} className="text-accent" />
        </button>

      </div>
      {/* TODO: ändra till loppisCard */}
    </section>
  )
}

export default PopularCarousel