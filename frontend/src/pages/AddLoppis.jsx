import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Input from '../components/Input'
import Button from '../components/Button'
//Type = adress fixas senare med google maps?

const AddLoppis = () => {

  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target

    if (checked) {
      // lägg till om den inte redan finns
      setSelectedCategories((prev) => [...prev, value])
    } else {
      // ta bort om man bockar ur
      setSelectedCategories((prev) => prev.filter((cat) => cat !== value))
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev)
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/loppis/categories') // justera URL vid behov
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }

        const data = await response.json()

        if (data.success) {
          setCategories(data.response)
          console.log('Fetched categories:', data.response)
        } else {
          console.warn('No categories found:', data.message)
          setCategories([]) // fallback
        }

      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        console.log('Category fetch complete')
        // Här kan du sätta loading till false om du har loading state
      }
    }

    fetchCategories()
  }, [])

  // Logga valda kategorier när de ändras
  useEffect(() => {
    console.log('Valda kategorier:', selectedCategories)
  }, [selectedCategories])




  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Formulär skickat!')
  }

  return (
    <section className='font-primary flex flex-col gap-8'>
      <h2>Lägg till en loppis</h2>
      {/*här ska man kunna upload images*/}

      <form
        className='flex flex-col gap-4' 
        onSubmit={handleSubmit}>
        <Input
          label='Rubrik'
          type='text'
          showLabel={false}
          required={true} />
        <Input
          label='Adress'
          type='text'
          showLabel={false}
          required={true} />
        <Input
          label='Datum/Tider'
          type='text'
          showLabel={false}
          required={true} />
        <Input
          label='Beskrivning'
          type='text'
          showLabel={false} />


        <div className="dropdown-container">

          <div className="flex" onClick={toggleDropdown}>
            Välj kategori
            {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>


          {isDropdownOpen && (
            <div className="dropdown-list">
              {categories.map(category => (
                <label key={category} className="dropdown-item">
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={handleCategoryChange}
                  />
                  {category}
                </label>
              ))}
            </div>
          )}
        </div>




        <Button
          text='Lägg till loppis'
          type='submit'
          ariaLabel='Skapa loppis' />

      </form>
    </section>
  )
}

export default AddLoppis