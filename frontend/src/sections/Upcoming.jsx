import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { getUpcomingLoppis } from '../services/loppisApi'

const Upcoming = () => {
  const [loppisList, setLoppisList] = useState([])
  const navigate = useNavigate()

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
    <section className="w-full max-w-3xl mt-10 px-4 sm:px-8">
      <h2 className="text-xl font-semibold mb-4">Kommande loppisar</h2>
      <div className="space-y-3">
        {loppisList.map((loppis) => (
          <div
            key={loppis._id}
            className="p-4 bg-white rounded-2xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{loppis.title}</h3>
              <p className="text-sm text-gray-600">
                {dateToString(loppis.nextDate.date)} • {loppis.location.address.city}
              </p>
            </div>
            <button
              onClick={() => navigate(`/loppis/${loppis._id}`)}
              className="text-accent font-semibold cursor-pointer"
            >
              Visa →
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Upcoming