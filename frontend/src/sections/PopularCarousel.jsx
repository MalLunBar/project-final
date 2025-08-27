import { useState, useEffect } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { ChevronLeft, ChevronRight } from "lucide-react"
import CarouselCard from '../components/CarouselCard'
import { getPopularLoppis } from '../services/loppisApi'

const PopularCarousel = () => {
  const [loppisList, setLoppisList] = useState([])

  // fetch popular loppis
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
    }
  })

  // recalculate slider after loppisList is fetched
  useEffect(() => {
    if (slider.current) {
      slider.current.update()
    }
  }, [loppisList, slider])

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h2 className="text-2xl font-bold">Populära Loppisar</h2>
      <div className="relative w-full ">
        {/* slider */}
        <div ref={sliderRef} className="keen-slider overflow-hidden py-1">
          {loppisList.map(loppis => <CarouselCard key={loppis._id} loppis={loppis} />
          )}
        </div>
        {/* left arrow */}
        <button
          onClick={() => slider.current?.prev()}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow cursor-pointer hover:bg-white transition-opacity duration-200"
        >
          <ChevronLeft size={24} strokeWidth={2} className="text-accent" />
        </button>
        {/* right arrow */}
        <button
          onClick={() => slider.current?.next()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow cursor-pointer hover:bg-white transition-opacity duration-200"
        >
          <ChevronRight size={24} strokeWidth={2} className="text-accent" />
        </button>

      </div>
    </section>
  )
}

export default PopularCarousel