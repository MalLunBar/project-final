import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import SearchBar from "../components/SearchBar"
import Button from "../components/Button"
import FilterOption from "../components/FilterOption"
import { getLoppisCategories } from '../services/loppisApi'

const SearchFilters = ({ cityInput, setCityInput, onSearch }) => {
  const [params, setParams] = useSearchParams()
  const [categoryOptions, setCategoryOptions] = useState()
  const dateOptions = [
    { id: 'all', label: 'Visa alla' },
    { id: 'today', label: 'Idag' },
    { id: 'tomorrow', label: 'Imorgon' },
    { id: 'weekend', label: 'I helgen' },
    { id: 'next_week', label: 'Nästa vecka' },
  ]

  // read from URL
  const selectedCity = cityInput
  const selectedDate = params.get("date") || "all"
  const selectedCategories = params.getAll("category")

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

  // generic onChange helper to update params
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(params)

    if (!value || value === "all") {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }

    setParams(newParams)
  }

  // toggle category
  const toggleCategory = (category) => {
    const newParams = new URLSearchParams(params)
    const categories = newParams.getAll("category")

    if (categories.includes(category)) {
      // remove
      const updated = categories.filter((c) => c !== category)
      newParams.delete("category")
      updated.forEach((c) => newParams.append("category", c))
    } else {
      // add
      newParams.append("category", category)
    }

    setParams(newParams)
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
        <SearchBar
          value={selectedCity}
          setValue={(e) => setCityInput(e.target.value)}
        />

        {/* Opening hours */}
        <fieldset className='space-y-2 md:space-y-3'>
          <legend className='font-medium'>Öppettider</legend>
          <div className='flex flex-wrap gap-1'>
            {dateOptions.map((option) => {
              return (
                <FilterOption
                  key={option.id}
                  type='radio'
                  name='dates'
                  value={option.id}
                  label={option.label}
                  checked={selectedDate === option.id}
                  onChange={(e) => updateParam("date", e.target.value)}
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
              return (
                <FilterOption
                  key={option}
                  type='checkbox'
                  name='categories'
                  value={option}
                  label={option}
                  checked={selectedCategories.includes(option)}
                  onChange={() => toggleCategory(option)}
                />
              )
            })}
          </div>
        </fieldset>

        {/* Submit button */}
        <Button
          text='Visa loppis'
          type='submit'
          ariaLabel='Sök efter loppis'
          onClick={onSearch}
        />

      </form>
    </div>
  )
}

export default SearchFilters