import { useState, useEffect } from 'react'
import useAuthStore from "../stores/useAuthStore";
import { ChevronDown, ChevronUp, Camera, Trash2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import Input from '../components/Input'
import Button from '../components/Button'
import SmallMap from '../components/SmallMap'
//Type = adress fixas senare med google maps?
//Gör ett error state för att senare kunna göra validering t.ex. att man måste välja en kategori
//lägg till en loading state för att visa att det laddar

const AddLoppis = () => {

  const { user } = useAuthStore.getState()
  const userId = user?._id ?? user?.id

  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [coordinates, setCoordinates] = useState(null)
  const [dates, setDates] = useState([{ date: "", startTime: "", endTime: "" }]) // For managing multiple dates

  const [formData, setFormData] = useState({
    title: "",
    street: "",
    city: "",
    postalCode: "",
    description: "",
    imageUrl: "",
    categories: [],
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
      setFormData(prev => ({ ...prev, categories: [...prev.categories, value] }))
    } else {
      // ta bort om man bockar ur
      setSelectedCategories((prev) => prev.filter((cat) => cat !== value))
      setFormData(prev => ({ ...prev, categories: prev.categories.filter((cat) => cat !== value) }))
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
        } else {
          console.warn('No categories found:', data.message)
          setCategories([]) // fallback
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        // set loading to false if you have a loading state
      }
    }
    fetchCategories()
  }, [])

  // Fetch coordinates based on address input
  const fetchCoordinates = async () => {
    setCoordinates(null) // reset coordinates before fetching
    if (!formData.street || !formData.city) return
    const address = `${formData.street}, ${formData.postalCode} ${formData.city}, Sweden`
    console.log('Fetching coordinates for address:', address)
    try {
      const response = await fetch(`http://localhost:8080/api/geocode?q=${encodeURIComponent(address)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch coordinates')
      }
      const data = await response.json()
      if (data.length > 0) {
        const { lat, lon } = data[0]
        console.log(`Coordinates for ${address}:`, lat, lon)
        setCoordinates([lat, lon])
      } else {
        console.warn('Kunde inte hitta adressen:', address)
        setCoordinates(null)
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error)
    } finally {
      // set loading to false if you have a loading state
    }
  }

  // Send loppis data to backend
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

  // function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const payload = {
        title: formData.title,
        dates: dates,
        location: {
          address: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
          }
        },
        categories: formData.categories,
        description: formData.description,
        createdBy: userId,
      }
      const created = await addLoppis(payload)
      console.log('Loppis added successfully:', created)
      // reset 
      setFormData({
        title: "",
        street: "",
        city: "",
        postalCode: "",
        description: "",
        imageUrl: "",
        categories: [],
      })
      setSelectedCategories([])
      setDates([{ date: "", startTime: "", endTime: "" }])
      setCoordinates(null)
      setIsDropdownOpen(false)
      // Optionally redirect or show success message
    } catch (err) {
      console.error('Error adding loppis:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className='flex flex-col gap-8 px-4 py-8 mx-auto max-w-2xl  mb-20 md:my-8 rounded-lg bg-white shadow-lg'>
      <h2 className='text-2xl font-semibold py-2'>Lägg till en loppis</h2>

      <form
        className='flex flex-col gap-6 divide-y divide-border'
        onSubmit={handleSubmit}>

        {/* loppis details */}
        <fieldset
          className='flex p-2 flex-col gap-4 pb-8'
        >
          <legend className='font-semibold text-lg pb-2'>Beskrivning</legend>

          {/* image upload placeholder */}
          <div className='flex py-10 w-full border-2 border-border border-dashed rounded-xl flex-col items-center justify-center gap-4'>
            <Camera size={50} />
            <p className='text-center'>Bilduppladdning kommer snart!</p>
          </div>

          <Input
            label='Rubrik*'
            type='text'
            value={formData.title}
            onChange={handleChange('title')}
            showLabel={false}
            required={true} />
          <Input
            label='Beskrivning'
            type='textarea'
            value={formData.description}
            onChange={handleChange('description')}
            showLabel={false} />

          {/* categories dropdown */}
          {/* Bryt ut kod till komponent istället??? */}
          <div className="dropdown-container border border-border rounded-3xl py-2 px-4 w-full">
            <div className="flex justify-between items-center" onClick={toggleDropdown}>
              Välj kategori(er)
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
        </fieldset>

        {/* loppis location */}
        <fieldset
          className='flex p-2 flex-col gap-4 pb-8'
        >
          <legend className='font-semibold text-lg pb-2'>Plats</legend>
          <Input
            label='Gatuadress*'
            type='text'
            value={formData.street}
            onChange={handleChange('street')}
            showLabel={false}
            required={true} />
          <Input
            label='Postnummer*'
            type='text'
            value={formData.postalCode}
            onChange={handleChange('postalCode')}
            showLabel={false}
            required={true} />
          <Input
            label='Stad*'
            type='text'
            value={formData.city}
            onChange={handleChange('city')}
            showLabel={false}
            required={true} />
          {/* visa plats på en karta */}
          <Button
            text='Visa på karta'
            type='button'
            onClick={fetchCoordinates}
          />
          {coordinates && (
            <SmallMap
              coordinates={coordinates}
            />
          )}
        </fieldset>

        {/* loppis dates */}
        <fieldset
          className='flex p-2 flex-col gap-4 pb-8'
        >
          <legend className='font-semibold text-lg pb-2' >Datum & Tider</legend>
          {dates.map((date, index) => (
            <div key={index} className='flex gap-2 flex-col md:flex-row md:items-center'>
              <Input
                label="Datum"
                type="date"
                value={date.date}
                onChange={(e) => {
                  const newDates = [...dates]
                  newDates[index].date = e.target.value
                  setDates(newDates)
                }}
                showLabel={false}
                required={true}
              />
              <Input
                label='Starttid'
                type='time'
                value={date.startTime}
                onChange={(e) => {
                  const newDates = [...dates]
                  newDates[index].startTime = e.target.value
                  setDates(newDates)
                }}
                showLabel={false}
                required={true} />
              <Input
                label='Sluttid'
                type='time'
                value={date.endTime}
                onChange={(e) => {
                  const newDates = [...dates]
                  newDates[index].endTime = e.target.value
                  setDates(newDates)
                }}
                showLabel={false}
                required={true} />
              {dates.length > 1 && (
                <Button
                  icon={Trash2}
                  type="button"
                  onClick={() => {
                    const newDates = dates.filter((_, i) => i !== index)
                    setDates(newDates)
                  }}
                  ariaLabel="Ta bort datum"
                />
              )}

            </div>
          ))}
          <Button
            text="+ Nytt datum"
            type="button"
            onClick={() => setDates([...dates, { date: "", startTime: "", endTime: "" }])}
          />
        </fieldset>

        {/* Submit button */}
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