import { useState, useEffect } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { ChevronLeft, ChevronRight } from "lucide-react"
import CarouselCard from '../components/CarouselCard'
import { getPopularLoppis } from '../services/loppisApi'

const PopularCarousel = () => {
  const [loppisList, setLoppisList] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)

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
      slider.current.on("slideChanged", (s) => {
        setCurrentSlide(s.track.details.rel) // rel = relative index
      })
    }
  }, [loppisList, slider])

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      slider.current?.next()
    } else if (e.key === "ArrowLeft") {
      slider.current?.prev()
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h2 className="text-2xl font-bold">Populära Loppisar</h2>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Popululära loppisar"
        className="mt-4 relative w-full"
      >
        {/* slider */}
        <div
          ref={sliderRef}
          aria-live="polite"
          tabIndex={0} // makes the carousel focusable
          onKeyDown={handleKeyDown} // attach key handling
          aria-label="Populära loppisar karusell. Använd vänster och höger pil för att navigera."
          className="keen-slider overflow-hidden"
        >
          {loppisList.map((loppis, idx) =>
            <CarouselCard
              key={loppis._id}
              loppis={loppis}
              index={idx}
              total={loppisList.length}
            />
          )}
        </div>
        {/* left arrow */}
        <button
          onClick={() => slider.current?.prev()}
          ria-label="Previous slide"
          title="Previous slide"
          className='group absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-md cursor-pointer hover:bg-white transition duration-200'
        >
          <ChevronLeft size={28} strokeWidth={2.5} className="text-button transition-transform duration-200 group-hover:-translate-x-1" />
        </button>
        {/* right arrow */}
        <button
          onClick={() => slider.current?.next()}
          aria-label="Next slide"
          title="Next slide"
          className="group absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-md cursor-pointer hover:bg-white transition duration-200"
        >
          <ChevronRight size={28} strokeWidth={2.5} className="text-button transition-transform duration-200 group-hover:translate-x-1" />
        </button>
        {/* pagination dots */}
        <div
          role="tablist"
          aria-label="Carousel pagination"
          className="flex justify-center mt-4 gap-2"
        >
          {loppisList.map((_, idx) => (
            <div
              key={idx}
              role="tab"
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={currentSlide === idx ? "true" : undefined}
              className={`w-2 h-2 rounded-full ${currentSlide === idx ? "bg-button" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularCarousel