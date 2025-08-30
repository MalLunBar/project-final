import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { ArrowRight } from 'lucide-react'
import { getUpcomingLoppis } from '../services/loppisApi'

const Upcoming = () => {
  const [loppisList, setLoppisList] = useState([])

  // fetch upcoming loppis list
  useEffect(() => {
    const fetchloppisList = async () => {
      // setLoading(true)
      // setError(null)
      // setEmptyMsg("")
      try {
        const data = await getUpcomingLoppis()
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

  const dateToString = (date) => {
    return `${format(date, 'EEE d MMM', { locale: sv })}`
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h2 className="text-2xl font-bold">Kommande loppisar</h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loppisList.map((loppis) => (
          <div
            key={loppis._id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm flex justify-between items-center gap-2"
          >
            <div>
              <h3 className="text-lg font-semibold">{loppis.title}</h3>
              <p className="text-zinc-600">
                {dateToString(loppis.nextDate.date)} • {loppis.location.address.city}
              </p>
            </div>
            <Link
              to={`/loppis/${loppis._id}`}
              className="group inline-flex items-center gap-1 hover:underline underline-offset-2 text-[#495D3C] font-semibold cursor-pointer"
            >
              Visa
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Upcoming