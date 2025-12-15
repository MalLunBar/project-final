
import { useState, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronUp, Camera, Trash2, Loader2 } from 'lucide-react'
import Input from './Input'
import Button from './Button'
import SmallMap from './SmallMap'
import PhotoDropzone from './PhotoDropzone'
import FilterTag from './FilterTag'
import ErrorMessage from './ErrorMessage'
import FieldError from './FieldError'
import { errorMessage } from '../utils/errorMessage'
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
  const [serverError, setServerError] = useState('')        // ← global form error (API, etc)
  const [categoriesError, setCategoriesError] = useState('')// ← fetch categories errors
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState('')

  // Stabil "init-nyckel" baserad på innehållet (inte referensen)
  const initKey = useMemo(() => JSON.stringify(initialValues ?? {}), [initialValues])

  // initiera state en gång från initialValues (innehåll)
  const init = useMemo(() => toInitialState(initialValues), [initKey])

  const [formData, setFormData] = useState(init.formData)
  const [selectedCategories, setSelectedCategories] = useState(init.selectedCategories)
  const [dates, setDates] = useState(init.dates)
  const [coordinates, setCoordinates] = useState(init.coordinates)

  // 🔁 Media från PhotoDropzone (en ENDA lista + removed)
  const [media, setMedia] = useState({ items: [], removedExistingPublicIds: [] })

  // --- validation state ---
  const [touched, setTouched] = useState({
    title: false, street: false, postalCode: false, city: false,
  })
  // datesTouched speglar dates.length
  const [datesTouched, setDatesTouched] = useState(dates.map(() => ({
    date: false, startTime: false, endTime: false,
  })))

  // re-init om initialValues ändras
  useEffect(() => {
    const next = toInitialState(initialValues)
    setFormData(next.formData)
    setSelectedCategories(next.selectedCategories)
    setDates(next.dates)
    setCoordinates(next.coordinates)
    setTouched({ title: false, street: false, postalCode: false, city: false })
    setDatesTouched(next.dates.map(() => ({ date: false, startTime: false, endTime: false })))
    setServerError('')
    setGeoError('')
  }, [initKey])


  const validateField = (key, val) => {
    const v = String(val || '').trim()
    switch (key) {
      case 'title':
        if (!v) return 'Rubrik är obligatorisk.'
        if (v.length < 3) return 'Rubriken måste vara minst 3 tecken.'
        return ''
      case 'street':
        if (!v) return 'Gatuadress är obligatorisk.'
        return ''
      case 'postalCode': {
        if (!v) return 'Postnummer är obligatoriskt.'
        const ok = /^[0-9]{3}\s?[0-9]{2}$/.test(v) // 12345 eller 123 45
        return ok ? '' : 'Ange ett giltigt postnummer (t.ex. 123 45).'
      }
      case 'city':
        if (!v) return 'Stad är obligatorisk.'
        return ''
      default:
        return ''
    }
  }

  const validateDateRow = (row) => {
    const errs = { date: '', startTime: '', endTime: '', range: '' }
    if (!row.date) errs.date = 'Datum är obligatoriskt.'
    if (!row.startTime) errs.startTime = 'Starttid är obligatorisk.'
    if (!row.endTime) errs.endTime = 'Sluttid är obligatorisk.'
    // Om alla finns, kontrollera att sluttid > starttid
    if (row.startTime && row.endTime) {
      const a = row.startTime
      const b = row.endTime
      if (a >= b) errs.range = 'Sluttid måste vara efter starttid.'
    }
    return errs
  }


  const fieldErrors = {
    title: validateField('title', formData.title),
    street: validateField('street', formData.street),
    postalCode: validateField('postalCode', formData.postalCode),
    city: validateField('city', formData.city),
  }
  const dateErrors = dates.map(validateDateRow)

  const hasAnyErrors = () => {
    if (Object.values(fieldErrors).some(Boolean)) return true
    for (const r of dateErrors) {
      if (r.date || r.startTime || r.endTime || r.range) return true
    }
    return false
  }

  // --- handlers ---
  const handleChange = (key) => (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, [key]: val }))
    if (key in touched && touched[key]) {
      // live-uppdatera fel
      // (fieldErrors beräknas om via render; ingen extra setState behövs här)
    }
  }

  const handleBlur = (key) => () => setTouched(prev => ({ ...prev, [key]: true }))



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
        setCategoriesError('')
        const cats = await getLoppisCategories()
        setCategories(cats || [])
      } catch (err) {
        setCategories([])
        setCategoriesError(errorMessage(err) || 'Kunde inte hämta kategorier just nu.')
      }
    }
    fetchCategories()
  }, [])

  const fetchCoordinates = async () => {
    setCoordinates(null)
    setGeoError('')
    if (!formData.street || !formData.city) {
      setGeoError('Fyll i gatuadress och stad först.')
      return
    }
    const address = `${formData.street}, ${formData.postalCode} ${formData.city}, Sweden`
    try {
      setGeoLoading(true)
      const { lat, lon } = await geocodeCity(address)
      if (!lat || !lon) throw new Error('Kunde inte hitta koordinater för adressen.')
      setCoordinates([lat, lon])
    } catch (err) {
      setCoordinates(null)
      setGeoError(errorMessage(err) || 'Kunde inte hämta koordinater.')
    } finally {
      setGeoLoading(false)
    }
  }




  // Cover + initialbilder till dropzone
  const orderedPublicIds = useMemo(() => {
    const ids = Array.isArray(initialValues?.images) ? initialValues.images : []
    const cover = initialValues?.coverImage
    return cover && ids.includes(cover) ? [cover, ...ids.filter(id => id !== cover)] : ids
  }, [initKey])

  const initialFilesForDropzone = useMemo(
    () => orderedPublicIds.map(pid => ({ url: IMG.thumb(pid), publicId: pid })),
    [orderedPublicIds]
  )



  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    setTouched({ title: true, street: true, postalCode: true, city: true })
    setDatesTouched(dates.map(() => ({ date: true, startTime: true, endTime: true })))

    if (hasAnyErrors()) return

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
        order,
        removedExistingPublicIds: media.removedExistingPublicIds,
        coverIndex: 0,
      }))
      for (const f of newFiles) fd.append('images', f)

      await onSubmit?.(fd)
    } catch (err) {
      setServerError(errorMessage(err) || 'Något gick fel när annonsen skulle sparas.')
    } finally {
      setSubmitting(false)
    }
  }

  const touchDate = (i, key) => {
    setDatesTouched(prev => {
      const next = [...prev]
      next[i] = { ...next[i], [key]: true }
      return next
    })
  }

  return (
    <section className='bg-white/90 backdrop-blur my-4 md:my-8 rounded-2xl xl:rounded-3xl mx-auto md:max-w-xl lg:max-w-4xl xl:max-w-6xl xl:mt-20 px-4 sm:px-6 py-10 md:px-18 lg:px-8 lg:py-6 lg:my-4 xl:px-20 xl:py-10 shadow-lg'>
      <h2 className='text-xl font-semibold mb-6'>{title}</h2>

      {/* Global/server error */}
      {serverError ? <ErrorMessage className="mb-4">{serverError}</ErrorMessage> : null}

      <form className='flex flex-col gap-4 divide-y divide-border' onSubmit={handleSubmit} noValidate>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">


          {/* VÄNSTER KOLUMN på large */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* photo-dropzone */}
            <fieldset className='flex p-2 flex-col gap-4 pb-6'>
              <legend
                className='font-semibold text-lg pb-2'
                id="photos-legend">Bilder</legend>
              <div
                className='relative flex py-8 w-full border-2 border-border rounded-xl flex-col items-center justify-center gap-4'
                aria-busy={submitting ? 'true' : 'false'}
                aria-live='polite'
              >
                <PhotoDropzone
                  key={initKey}
                  initialFiles={initialFilesForDropzone}
                  maxFiles={6}
                  maxSizeMB={5}
                  onChange={setMedia}
                  ariaLabelledBy="photos-legend"
                />

                {submitting && (
                  <div className="absolute inset-0 grid place-items-center bg-white/60 backdrop-blur-[2px] rounded-xl">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </div>
            </fieldset>

            {/* Beskrivning */}
            <fieldset className='flex p-2 flex-col gap-4 pb-6'>
              <legend className='font-semibold text-lg pb-2'>Beskrivning</legend>

              <div>
                <Input
                  label='Rubrik*'
                  type='text'
                  value={formData.title}
                  onChange={handleChange('title')}
                  onBlur={handleBlur('title')}
                  showLabel={false}
                  required
                  aria-invalid={touched.title && Boolean(fieldErrors.title)}
                  aria-describedby={touched.title && fieldErrors.title ? 'err-title' : undefined}
                />
                <FieldError id="err-title" show={touched.title && !!fieldErrors.title}>
                  {fieldErrors.title}
                </FieldError>
              </div>


              <div>
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

              {categoriesError ? (
                <FieldError id="err-cats" show>{categoriesError}</FieldError>
              ) : null}

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


              <div>
                <Input
                  label='Gatuadress*'
                  type='text'
                  value={formData.street}
                  onChange={handleChange('street')}
                  onBlur={handleBlur('street')}
                  showLabel={false}
                  required
                  aria-invalid={touched.street && Boolean(fieldErrors.street)}
                  aria-describedby={touched.street && fieldErrors.street ? 'err-street' : undefined}
                />
                <FieldError id="err-street" show={touched.street && !!fieldErrors.street}>
                  {fieldErrors.street}
                </FieldError>
              </div>


              <div>
                <Input
                  label='Postnummer*'
                  type='text'
                  value={formData.postalCode}
                  onChange={handleChange('postalCode')}
                  onBlur={handleBlur('postalCode')}
                  showLabel={false}
                  required
                  aria-invalid={touched.postalCode && Boolean(fieldErrors.postalCode)}
                  aria-describedby={touched.postalCode && fieldErrors.postalCode ? 'err-postal' : undefined}
                />
                <FieldError id="err-postal" show={touched.postalCode && !!fieldErrors.postalCode}>
                  {fieldErrors.postalCode}
                </FieldError>
              </div>


              <div>
                <Input
                  label='Stad*'
                  type='text'
                  value={formData.city}
                  onChange={handleChange('city')}
                  onBlur={handleBlur('city')}
                  showLabel={false}
                  required
                  aria-invalid={touched.city && Boolean(fieldErrors.city)}
                  aria-describedby={touched.city && fieldErrors.city ? 'err-city' : undefined}
                />
                <FieldError id="err-city" show={touched.city && !!fieldErrors.city}>
                  {fieldErrors.city}
                </FieldError>
              </div>



              <div className="flex items-center gap-2">
                <Button text={geoLoading ? 'Hämtar…' : 'Visa på karta'} type='button' onClick={fetchCoordinates} disabled={geoLoading} />
                {geoLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              </div>
              {geoError ? <FieldError id="err-geo" show>{geoError}</FieldError> : null}
              {coordinates && <SmallMap coordinates={coordinates} />}

            </fieldset>

            {/* Datum & tider */}
            <fieldset className='flex-grow min-w-0 flex p-2 flex-col gap-4 pb-6'>
              <legend className='font-semibold text-lg pb-2'>Datum & Tider</legend>

              {dates.map((row, i) => {
                const errs = dateErrors[i]
                const t = datesTouched[i] || { date: false, startTime: false, endTime: false }
                return (
                  <div key={i} className='flex gap-2 items-start'>
                    <div className='w-full min-w-0 flex-1 flex flex-col sm:flex-row gap-2'>
                      <div className="flex-1">
                        <Input
                          label='Datum'
                          type='date'
                          value={row.date}
                          onChange={(e) => {
                            const nd = [...dates]; nd[i].date = e.target.value; setDates(nd)
                          }}
                          onBlur={() => touchDate(i, 'date')}
                          showLabel={true}
                          required
                          aria-invalid={t.date && Boolean(errs.date)}
                          aria-describedby={t.date && errs.date ? `err-date-${i}` : undefined}
                        />
                        <FieldError id={`err-date-${i}`} show={t.date && !!errs.date}>
                          {errs.date}
                        </FieldError>
                      </div>

                      <div className="flex-1">
                        <Input
                          label='Starttid'
                          type='time'
                          value={row.startTime}
                          onChange={(e) => {
                            const nd = [...dates]; nd[i].startTime = e.target.value; setDates(nd)
                          }}
                          onBlur={() => touchDate(i, 'startTime')}
                          showLabel={true}
                          required
                          aria-invalid={t.startTime && Boolean(errs.startTime)}
                          aria-describedby={t.startTime && errs.startTime ? `err-start-${i}` : undefined}
                        />
                        <FieldError id={`err-start-${i}`} show={t.startTime && !!errs.startTime}>
                          {errs.startTime}
                        </FieldError>
                      </div>

                      <div className="flex-1">
                        <Input
                          label='Sluttid'
                          type='time'
                          value={row.endTime}
                          onChange={(e) => {
                            const nd = [...dates]; nd[i].endTime = e.target.value; setDates(nd)
                          }}
                          onBlur={() => touchDate(i, 'endTime')}
                          showLabel={true}
                          required
                          aria-invalid={t.endTime && Boolean(errs.endTime || errs.range)}
                          aria-describedby={t.endTime && (errs.endTime || errs.range) ? `err-end-${i}` : undefined}
                        />
                        <FieldError id={`err-end-${i}`} show={t.endTime && !!(errs.endTime || errs.range)}>
                          {errs.endTime || errs.range}
                        </FieldError>
                      </div>
                    </div>

                    {dates.length > 1 && (
                      <Button
                        icon={Trash2}
                        type='button'
                        onClick={() => {
                          setDates(dates.filter((_, idx) => idx !== i))
                          setDatesTouched(datesTouched.filter((_, idx) => idx !== i))
                        }}
                        ariaLabel='Ta bort datum'
                        classNames='shrink-0 self-end mb-1'
                      />
                    )}
                  </div>
                )
              })}

              <Button
                text='+ Nytt datum'
                type='button'
                onClick={() => {
                  setDates([...dates, { date: '', startTime: '', endTime: '' }])
                  setDatesTouched([...datesTouched, { date: false, startTime: false, endTime: false }])
                }}
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
            icon={submitting ? Loader2 : null}
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