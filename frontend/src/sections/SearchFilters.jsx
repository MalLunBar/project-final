import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button"
import FilterOption from "../components/FilterOption"

const SearchFilters = ({ query, setQuery, onSearch }) => {

  const dateOptions = [
    { id: 'all', label: 'Visa alla' },
    { id: 'today', label: 'Idag' },
    { id: 'tomorrow', label: 'Imorgon' },
    { id: 'weekend', label: 'I helgen' },
    { id: 'week', label: 'Denna veckan' },
  ]

  // change to fetch categories from api later
  const categoryOptions = [
    "Vintage",
    "Barn",
    "Trädgård",
    "Kläder",
    "Möbler",
    "Böcker",
    "Husdjur",
    "Elektronik",
    "Kök",
    "Blandat"
  ]

  // generic onChange helper
  const handleChange = (key) => (e) => {
    setQuery(prev => ({ ...prev, [key]: e.target.value }))
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
    <aside
      className='h-full p-4 bg-white border-r border-border shadow-sm'
      aria-label='Search Filters'
    >
      <h3 className='text-lg font-semibold py-2'>Sökfilter</h3>

      <form
        className='flex flex-col gap-6 py-4'
        onSubmit={onSearch}
      >

        {/* Search address */}
        {/* Add a search icon? */}
        <Input
          label='Område'
          type='text'
          value={query.address}
          onChange={handleChange('address')}
          showLabel={true}
          required={false}
          placeholder='Skriv stad eller adress'
        />

        {/* Opening hours */}
        <fieldset className='space-y-3'>
          <legend className='font-medium'>Öppettider</legend>
          <div className='flex flex-wrap gap-1'>
            {dateOptions.map((option) => {
              const selected = query.dates === option.id
              return (
                <FilterOption
                  key={option.id}
                  type='radio'
                  name='dates'
                  value={option.id}
                  label={option.label}
                  selected={selected}
                  onChange={handleChange('dates')}
                />
              )
            })}
          </div>
        </fieldset>

        {/* Categories */}
        <fieldset className='space-y-3'>
          <legend className='font-medium'>Kategorier</legend>
          <div className='flex flex-wrap gap-1'>
            {categoryOptions.map((option) => {
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
    </aside>
  )
}

export default SearchFilters