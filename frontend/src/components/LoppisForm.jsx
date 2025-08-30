
import { useState, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronUp, Camera, Trash2 } from 'lucide-react'
import Input from './Input'
import Button from './Button'
import SmallMap from './SmallMap'
import PhotoDropzone from './PhotoDropzone'
import FilterTag from './FilterTag'
import { IMG } from '../utils/imageVariants'
import { geocodeCity } from '../services/geocodingApi'
import { getLoppisCategories } from '../services/loppisApi'



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


  // 🔁 Media från PhotoDropzone (en ENDA lista + removed)
  const [media, setMedia] = useState({ items: [], removedExistingPublicIds: [] })

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

  const removeCategory = (category) => {
    setSelectedCategories(prev => prev.filter(cat => cat !== category))
    setFormData(prev => ({ ...prev, categories: prev.categories.filter(cat => cat !== category) }))
  }

  const toggleDropdown = () => setIsDropdownOpen(v => !v)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getLoppisCategories()
        setCategories(categories)
      } catch (err) {
        // --------------------TODO: handle error appropriately
        console.error('Error fetching categories:', err)
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
      const { lat, lon } = await geocodeCity(address)
      if (!lat || !lon) {
        throw new Error('Kunde inte hitta koordinater för adressen')
      }
      setCoordinates([lat, lon])
    } catch (err) {
      // --------------------TODO: handle error appropriately
      console.error('Error fetching coordinates:', err)
      setCoordinates(null)
    } finally {
      // -------------------TODO: handle loading state
    }
  }


  // 🧠 Omslag först, med publicIds
  const orderedPublicIds = useMemo(() => {
    const ids = Array.isArray(initialValues?.images) ? initialValues.images : []
    const cover = initialValues?.coverImage
    return cover && ids.includes(cover) ? [cover, ...ids.filter(id => id !== cover)] : ids
  }, [initKey])

  // 🚀 Gör riktiga Cloudinary-URL:er + behåll publicId för varje bild
  const initialFilesForDropzone = useMemo(
    () => orderedPublicIds.map(pid => ({ url: IMG.thumb(pid), publicId: pid })),
    [orderedPublicIds]
  )



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
      }

      const order = []
      const newFiles = []
      let newIdx = 0
      for (const it of media.items) {
        if (it.kind === 'existing') {
          order.push({ type: 'existing', publicId: it.publicId })
        } else {
          order.push({ type: 'new', index: newIdx })
          newFiles.push(it.file)
          newIdx++
        }
      }

      const fd = new FormData()
      fd.append('data', JSON.stringify({
        ...payload,
        order,                                // exakt ordning (existing via publicId, new via index)
        removedExistingPublicIds: media.removedExistingPublicIds,
        coverIndex: 0                         // index 0 i 'order' är omslag
      }))

      // Lägg till nya filer i exakt den ordning användaren har
      for (const f of newFiles) fd.append('images', f)

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
    <section className='bg-white/90 backdrop-blur my-4 md:my-8 rounded-2xl xl:rounded-3xl mx-auto md:max-w-xl lg:max-w-4xl xl:max-w-6xl xl:mt-20 px-4 sm:px-6 py-10 md:px-18 lg:px-8 lg:py-6 lg:my-4 xl:px-20 xl:py-10 shadow-lg'>
      <h2 className='text-xl font-semibold mb-6'>{title}</h2>

      <form className='flex flex-col gap-4 divide-y divide-border' onSubmit={handleSubmit}>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* VÄNSTER KOLUMN på large */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Foto-dropzone */}
            <fieldset className='flex p-2 flex-col gap-4 pb-6'>
              <legend
                className='font-semibold text-lg pb-2'
                id="photos-legend">Bilder</legend>
              <div className='flex py-8 w-full border-2 border-border rounded-xl flex-col items-center justify-center gap-4'>
                <PhotoDropzone
                  key={initKey}
                  initialFiles={initialFilesForDropzone}
                  maxFiles={6}
                  maxSizeMB={5}
                  onChange={setMedia}
                  ariaLabelledBy="photos-legend"
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
              <div className="">
                <label
                  htmlFor='loppis-description'
                  className='sr-only'>
                  Beskrivning
                </label>
                <textarea
                  className="w-full bg-white border border-border rounded-3xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent"
                  rows="4"
                  id='loppis-description'
                  value={formData.description}
                  onChange={handleChange('description')}
                  placeholder='Beskrivning'
                />
              </div>
              {/* Kategorier */}
              {/* Dropdown select */}
              <div className='bg-white border border-border rounded-3xl py-2 px-4 max-w-60'>
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
              {/* Display selected categories */}
              {selectedCategories.length !== 0 &&
                <div className='flex flex-wrap gap-1'>
                  {selectedCategories.map(category =>
                    <FilterTag
                      key={category}
                      text={category}
                      onClick={() => removeCategory(category)}
                    />
                  )
                  }
                </div>
              }
            </fieldset>
          </div>
          {/* HÖGER KOLUMN på large */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
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
            <fieldset className='flex-grow min-w-0 flex p-2 flex-col gap-4 pb-6'>
              <legend className='font-semibold text-lg pb-2'>Datum & Tider</legend>

              {dates.map((date, index) => (
                <div
                  key={index}
                  className='flex gap-2 items-center'
                >
                  <div className='flex-grow min-w-0 flex gap-2'>
                    <Input
                      label='Datum'
                      type='date'
                      value={date.date}
                      onChange={(e) => {
                        const nd = [...dates]; nd[index].date = e.target.value; setDates(nd)
                      }}
                      showLabel={true}
                      placeholder='Välj datum'
                      required
                    />
                    <Input
                      label='Starttid'
                      type='time'
                      value={date.startTime}
                      onChange={(e) => {
                        const nd = [...dates]; nd[index].startTime = e.target.value; setDates(nd)
                      }}
                      showLabel={true}
                      placeholder='Välj tid'
                      required
                    />
                    <Input
                      label='Sluttid'
                      type='time'
                      value={date.endTime}
                      onChange={(e) => {
                        const nd = [...dates]; nd[index].endTime = e.target.value; setDates(nd)
                      }}
                      showLabel={true}
                      placeholder='Välj tid'
                      required
                    />
                  </div>
                  {dates.length > 1 && (
                    <Button
                      icon={Trash2}
                      type='button'
                      onClick={() => setDates(dates.filter((_, i) => i !== index))}
                      ariaLabel='Ta bort datum'
                      classNames='shrink-0 self-end mb-1'
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
          </div>
        </div>

        {/* Submit / Footer */}
        <div className='flex items-center lg:justify-center gap-2 pt-2'>
          <Button
            text={submitting ? 'Sparar…' : submitLabel}
            type='submit'
            ariaLabel={submitLabel}
            disabled={submitting}
          />

          <Button
            text='Avbryt'
            type='button'
            onClick={onCancel}
            variant='secondary'
          />

        </div>
      </form>
    </section>
  )
}


export default LoppisForm