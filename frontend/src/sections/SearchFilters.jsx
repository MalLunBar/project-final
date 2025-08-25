import { useState, useEffect } from "react"
import Input from "../components/Input"
import Button from "../components/Button"
import FilterOption from "../components/FilterOption"
import { getLoppisCategories } from '../services/loppisApi'

const SearchFilters = ({ query, setQuery, onSearch }) => {
  const [categoryOptions, setCategoryOptions] = useState()
  const dateOptions = [
    { id: 'all', label: 'Visa alla' },
    { id: 'today', label: 'Idag' },
    { id: 'tomorrow', label: 'Imorgon' },
    { id: 'weekend', label: 'I helgen' },
    { id: 'next_week', label: 'Nästa vecka' },
  ]

  // fetch category options
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getLoppisCategories()
        setCategoryOptions(categories)
      } catch (err) {
        // --------------------TODO: handle error appropriately
        console.error('Error fetching categories:', err)
        setCategoryOptions([])
      }
    }
    fetchCategories()
  }, [])

  // generic onChange helper
  const handleChange = (key) => (e) => {
    setQuery(prev => ({ ...prev, [key]: e.target.value }))
  }

  // dates onChange helper
  const changeDates = (e) => {
    setQuery((prev) => ({
      ...prev,
      dates: dateOptions.find((f) => f.id === e.target.value)
    }))
  }

  // toggle category
  const toggleCategory = (value) => {
    if (query.categories.includes(value)) {
      setQuery((prev => ({ ...prev, categories: prev.categories.filter((cat) => cat !== value) })))
    } else {
      setQuery(prev => ({ ...prev, categories: [...prev.categories, value] }))
    }
  }

  return (
    <div
      className='h-full w-full space-y-2 md:space-y-4'
      aria-label='Search Filters'
    >
      <h3 className='text-lg font-semibold'>Sökfilter</h3>

      <form
        className='flex flex-col gap-4 md:gap-6'
        onSubmit={onSearch}
      >

        {/* Search on city */}
        {/* Add a search icon? */}
        <Input
          label='Område'
          type='text'
          value={query.city}
          onChange={handleChange('city')}
          showLabel={true}
          required={false}
          placeholder='Sök stad eller område'
        />

        {/* Opening hours */}
        <fieldset className='space-y-2 md:space-y-3'>
          <legend className='font-medium'>Öppettider</legend>
          <div className='flex flex-wrap gap-1'>
            {dateOptions.map((option) => {
              const selected = query.dates.id === option.id
              return (
                <FilterOption
                  key={option.id}
                  type='radio'
                  name='dates'
                  value={option.id}
                  label={option.label}
                  selected={selected}
                  onChange={changeDates}
                />
              )
            })}
          </div>
        </fieldset>

        {/* Categories */}
        <fieldset className='space-y-2 md:space-y-3'>
          <legend className='font-medium'>Kategorier</legend>
          <div className='flex flex-wrap gap-1'>
            {categoryOptions?.map((option) => {
              const selected = query.categories.includes(option)
              return (
                <FilterOption
                  key={option}
                  type='checkbox'
                  name='categories'
                  value={option}
                  label={option}
                  selected={selected}
                  onChange={() => toggleCategory(option)}
                />
              )
            })}
          </div>
        </fieldset>

        {/* Submit button */}
        <Button
          text='Hitta loppis'
          type='submit'
          ariaLabel='Sök efter loppis'
          onClick={onSearch}
        />

      </form>
    </div>
  )
}

export default SearchFilters