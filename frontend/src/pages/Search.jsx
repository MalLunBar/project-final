//Ändra till SearchResult?
import { useEffect, useState } from "react"
import Input from "../components/Input"
import LoppisList from "../components/LoppisList"

const Search = () => {

  const [loppisList, setLoppisList] = useState([])

  useEffect(() => {
    // Simulate fetching loppis data
    const fetchLoppisData = async () => {
      try {
        const response = await fetch('/api/loppis')
        if (!response.ok) {
          throw new Error('Failed to fetch loppis data')
        }
        const data = await response.json()
        setLoppisList(data)
      } catch (error) {
        console.error('Error fetching loppis data:', error)
      } finally {
        console.log('Loppis data fetched successfully')
        //här kan vi ha loading set to false 
      }
    }
    fetchLoppisData()
  }, [])


  return (
    <section>
      <div>
        <h2>Hitta en loppis</h2>
        <Input
          label='Sök loppis'
          type='text'
        />
        { /* här ska filter visas */}
        { /* här ska mapview eller listview visas */}


      </div>

      <div>

        {/* Antalet loppisar på den sökningen? */}
        {loppisList.length > 0 ? (
          <LoppisList loppisList={loppisList} />
        ) : (
          <p>Inga loppisar hittades</p>
        )}

        <LoppisList loppisList={loppisList} />

      </div>
    </section>
  )
}

export default Search