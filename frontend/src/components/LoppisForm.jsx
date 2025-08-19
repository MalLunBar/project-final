// src/components/LoppisForm.jsx
import { useState, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronUp, Camera, Trash2 } from 'lucide-react'
import Input from './Input'
import Button from './Button'
import SmallMap from './SmallMap'
import PhotoDropzone from './PhotoDropzone'
import { IMG } from '../utils/imageVariants'

const normalizeDateInput = (val) => {
  if (!val) return ''
  try {
    // ISO eller Date → yyyy-mm-dd
    const d = new Date(val)
    if (Number.isNaN(d.getTime())) return String(val).slice(0, 10)
    return d.toISOString().slice(0, 10)
  } catch {
    return String(val).slice(0, 10)
  }
}

const toInitialState = (initialValues) => {
  // fallback till tomma värden
  const iv = initialValues || {}
  const addr = iv.location?.address || {}

  return {
    formData: {
      title: iv.title || '',
      street: addr.street || '',
      city: addr.city || '',
      postalCode: addr.postalCode || '',
      description: iv.description || '',
      imageUrl: iv.imageUrl || '',
      categories: Array.isArray(iv.categories) ? iv.categories : [],
    },
    selectedCategories: Array.isArray(iv.categories) ? iv.categories : [],
    dates: Array.isArray(iv.dates) && iv.dates.length
      ? iv.dates.map(d => ({
        date: normalizeDateInput(d.date),
        startTime: d.startTime || '',
        endTime: d.endTime || '',
      }))
      : [{ date: '', startTime: '', endTime: '' }],
    coordinates: Array.isArray(iv.location?.coordinates?.coordinates)
      ? [
        // backend: [lon, lat] → vi vill [lat, lon]
        iv.location.coordinates.coordinates[1],
        iv.location.coordinates.coordinates[0],
      ]
      : null,
  }
}

const LoppisForm = ({
  initialValues,
  submitLabel = 'Spara',
  title = 'Redigera Loppis',
  onSubmit,          // (payload) => Promise<void | any>
  onCancel,          // () => void
}) => {
  const [categories, setCategories] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Stabil "init-nyckel" baserad på innehållet (inte referensen)
  const initKey = useMemo(() => JSON.stringify(initialValues ?? {}), [initialValues])

  // initiera state en gång från initialValues (innehåll)
  const init = useMemo(() => toInitialState(initialValues), [initKey])

  const [formData, setFormData] = useState(init.formData)
  const [selectedCategories, setSelectedCategories] = useState(init.selectedCategories)
  const [dates, setDates] = useState(init.dates)
  const [coordinates, setCoordinates] = useState(init.coordinates)
  const [photos, setPhotos] = useState([])

  // re-init om initialValues ändras
  useEffect(() => {
    const next = toInitialState(initialValues)
    setFormData(next.formData)
    setSelectedCategories(next.selectedCategories)
    setDates(next.dates)
    setCoordinates(next.coordinates)
  }, [initKey])

  const handleChange = (key) => (e) => {
    setFormData(prev => ({ ...prev, [key]: e.target.value }))
  }

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setSelectedCategories(prev => [...prev, value])
      setFormData(prev => ({ ...prev, categories: [...prev.categories, value] }))
    } else {
      setSelectedCategories(prev => prev.filter(cat => cat !== value))
      setFormData(prev => ({ ...prev, categories: prev.categories.filter(cat => cat !== value) }))
    }
  }

  const toggleDropdown = () => setIsDropdownOpen(v => !v)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/loppis/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data?.response ?? [])
      } catch (e) {
        console.error('Error fetching categories:', e)
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  const fetchCoordinates = async () => {
    setCoordinates(null)
    if (!formData.street || !formData.city) return
    const address = `${formData.street}, ${formData.postalCode} ${formData.city}, Sweden`
    try {
      const response = await fetch(`http://localhost:8080/api/geocode?q=${encodeURIComponent(address)}`)
      if (!response.ok) throw new Error('Failed to fetch coordinates')
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        const { lat, lon } = data[0]
        setCoordinates([lat, lon])
      } else {
        setCoordinates(null)
      }
    } catch (e) {
      console.error('Error fetching coordinates:', e)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)

      const payload = {
        title: formData.title,
        dates,
        location: {
          address: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
          }
        },
        categories: formData.categories,
        description: formData.description,
        // imageUrl: formData.imageUrl, // lägg till när uppladdning är klar
      }

      // Bygg multipart form data
      const fd = new FormData()
      fd.append('data', JSON.stringify(payload))
      // Viktigt: bevara ordningen så att första bilden = omslag
      photos.forEach((file, i) => {
        fd.append('images', file) // backend: upload.array('images')
      })

      await onSubmit?.(fd)
    } finally {
      setSubmitting(false)
    }
  }


  // Visa redan uppladdade bilder i dropzonen – memoiserat på initKey
  const initialPublicIds = useMemo(
    () => (Array.isArray(initialValues?.images) ? initialValues.images : []),
    [initKey]
  )
  const cover = initialValues?.coverImage
  const orderedIds = useMemo(
    () => (cover ? [cover, ...initialPublicIds.filter(pid => pid !== cover)] : initialPublicIds),
    [cover, initialPublicIds]
  )

  // generera små Cloudinary-URLs för preview
  const initialPreviewUrls = useMemo(
    () => orderedIds.map(pid => IMG.thumb(pid)),
    [orderedIds]
  )

  return (
    <section className='flex flex-col gap-4 mx-auto max-w-2xl rounded-lg bg-white'>
      <h2 className='text-xl font-semibold'>{title}</h2>

      <form className='flex flex-col gap-4 divide-y divide-border' onSubmit={handleSubmit}>


        {/* Foto-dropzone */}
        <fieldset className='flex p-2 flex-col gap-4 pb-6'>
          <legend className='font-semibold text-lg pb-2'>Bilder</legend>
          <div className='flex py-8 w-full border-2 border-border rounded-xl flex-col items-center justify-center gap-4'>
            <PhotoDropzone
              key={initKey}
              initialFiles={initialPreviewUrls}
              maxFiles={6}
              maxSizeMB={5}
              onFilesChange={setPhotos}
            />
          </div>
        </fieldset>

        {/* Beskrivning */}
        <fieldset className='flex p-2 flex-col gap-4 pb-6'>
          <legend className='font-semibold text-lg pb-2'>Beskrivning</legend>
          <Input
            label='Rubrik*'
            type='text'
            value={formData.title}
            onChange={handleChange('title')}
            showLabel={false}
            required
          />
          <Input
            label='Beskrivning'
            type='textarea'
            value={formData.description}
            onChange={handleChange('description')}
            showLabel={false}
          />

          {/* Kategorier */}
          <div className='border border-border rounded-3xl py-2 px-4 w-full'>
            <div className='flex justify-between items-center cursor-pointer' onClick={toggleDropdown}>
              Välj kategori(er)
              {isDropdownOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            </div>
            {isDropdownOpen && (
              <div className='flex flex-col gap-2 mt-2'>
                {categories?.map(category => {
                  const id = `category-${category}`
                  return (
                    <div key={category} className='relative'>
                      <input
                        type='checkbox'
                        id={id}
                        value={category}
                        checked={selectedCategories.includes(category)}
                        onChange={handleCategoryChange}
                        className='absolute opacity-0 peer'
                      />
                      <label
                        htmlFor={id}
                        className='block cursor-pointer px-4 py-2 rounded bg-accent-light peer-checked:bg-accent text-black peer-checked:text-white transition-colors'
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

        {/* Plats */}
        <fieldset className='flex p-2 flex-col gap-4 pb-6'>
          <legend className='font-semibold text-lg pb-2'>Plats</legend>
          <Input label='Gatuadress*' type='text' value={formData.street} onChange={handleChange('street')} showLabel={false} required />
          <Input label='Postnummer*' type='text' value={formData.postalCode} onChange={handleChange('postalCode')} showLabel={false} required />
          <Input label='Stad*' type='text' value={formData.city} onChange={handleChange('city')} showLabel={false} required />
          <Button text='Visa på karta' type='button' onClick={fetchCoordinates} />
          {coordinates && <SmallMap coordinates={coordinates} />}
        </fieldset>

        {/* Datum & tider */}
        <fieldset className='flex p-2 flex-col gap-4 pb-6'>
          <legend className='font-semibold text-lg pb-2'>Datum & Tider</legend>

          {dates.map((date, index) => (
            <div key={index} className='flex gap-2 flex-col md:flex-row md:items-center'>
              <Input
                label='Datum'
                type='date'
                value={date.date}
                onChange={(e) => {
                  const nd = [...dates]; nd[index].date = e.target.value; setDates(nd)
                }}
                showLabel={false}
                required
              />
              <Input
                label='Starttid'
                type='time'
                value={date.startTime}
                onChange={(e) => {
                  const nd = [...dates]; nd[index].startTime = e.target.value; setDates(nd)
                }}
                showLabel={false}
                required
              />
              <Input
                label='Sluttid'
                type='time'
                value={date.endTime}
                onChange={(e) => {
                  const nd = [...dates]; nd[index].endTime = e.target.value; setDates(nd)
                }}
                showLabel={false}
                required
              />

              {dates.length > 1 && (
                <Button
                  icon={Trash2}
                  type='button'
                  onClick={() => setDates(dates.filter((_, i) => i !== index))}
                  ariaLabel='Ta bort datum'
                />
              )}
            </div>
          ))}

          <Button
            text='+ Nytt datum'
            type='button'
            onClick={() => setDates([...dates, { date: '', startTime: '', endTime: '' }])}
          />
        </fieldset>

        {/* Submit / Footer */}
        <div className='flex items-center gap-2 pt-2'>
          <Button
            text={submitting ? 'Sparar…' : submitLabel}
            type='submit'
            ariaLabel={submitLabel}
            disabled={submitting}
          />
          {onCancel && (
            <Button
              text='Avbryt'
              type='button'
              onClick={onCancel}
              variant='secondary'
            />
          )}
        </div>
      </form>
    </section>
  )
}


export default LoppisForm