import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Input from '../components/Input'
import Button from '../components/Button'
//Type = adress fixas senare med google maps?
//Gör ett error state för att senare kunna göra validering t.ex. att man måste välja en kategori
//lägg till en loading state för att visa att det laddar

const AddLoppis = () => {

  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    date: "",
    startTime: "",
    endTime: "",
    latitude: "",
    longitude: "",
    description: "",

  })


  // Generisk onChange-helper
  const handleChange = (key) => (e) => {
    setFormData(prev => ({ ...prev, [key]: e.target.value }))
  }




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

  // Funktion för att skicka loppisdata till servern
  const addLoppis = async (payload) => {
    const res = await fetch('http://localhost:8080/loppis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Failed: ${res.status}`)
    }
    return data.response
  }

  // Logga valda kategorier när de ändras
  useEffect(() => {
    console.log('Valda kategorier:', selectedCategories)
  }, [selectedCategories])

  //async/await för att vänta på formulärets submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)

      const payload = {

        title: formData.title,
        address: formData.address,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        categories: selectedCategories,
        description: formData.description,

      }

      const created = await addLoppis(payload)
      console.log('Loppis added:', created)

      // reset 
      setFormData({
        title: "",
        address: "",
        date: "",
        startTime: "",
        endTime: "",
        latitude: "",
        longitude: "",
        description: "",
      })
      setSelectedCategories([])
      setIsDropdownOpen(false)

    } catch (err) {
      console.error('Error adding loppis:', err)

    } finally {
      setSubmitting(false)
    }
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
          value={formData.title}
          onChange={handleChange('title')}
          showLabel={false}
          required={true} />
        <Input
          label='Adress'
          type='text'
          value={formData.address}
          onChange={handleChange('address')}
          showLabel={false}
          required={true} />

        <Input
          label="Datum"
          type="date"
          value={formData.date}
          onChange={handleChange('date')}
          showLabel={false}
          required={true}
        />
        <Input
          label='Starttid'
          type='time'
          value={formData.startTime}
          onChange={handleChange('startTime')}
          showLabel={false}
          required={true} />
        <Input
          label='Sluttid'
          type='time'
          value={formData.endTime}
          onChange={handleChange('endTime')}
          showLabel={false}
          required={true} />
        <Input
          label='Beskrivning'
          type='text'
          value={formData.description}
          onChange={handleChange('description')}
          showLabel={false} />


        <div className="dropdown-container border border-border rounded-3xl shadow-[0_4px_4px_0_rgba(0,0,0,0.10)] py-2 px-4 w-2/3">

          <div className="flex justify-between items-center" onClick={toggleDropdown}>
            Välj kategori
            {isDropdownOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
          </div>


          {isDropdownOpen && (
            <div className="dropdown-list flex flex-col gap-2 mt-2">
              {categories?.map(category => {
                const id = `category-${category}`;
                return (
                  <div key={category} className="relative">
                    <input
                      type="checkbox"
                      id={id}
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={handleCategoryChange}
                      className="absolute opacity-0 peer"
                    />
                    <label
                      htmlFor={id}
                      className="block cursor-pointer px-4 py-2 rounded bg-accent-light peer-checked:bg-accent text-black peer-checked:text-white transition-colors"
                    >
                      {category}
                    </label>
                  </div>
                )
              })}
            </div>
          )}
        </div>




        <Button
          text={submitting ? 'Sparar…' : 'Lägg till loppis'}
          type='submit'
          ariaLabel='Skapa loppis'
          disabled={submitting} />

      </form>
    </section>
  )
}

export default AddLoppis