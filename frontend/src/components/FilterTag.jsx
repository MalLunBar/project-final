import { X } from 'lucide-react'

const FilterTag = ({ text, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Remove filter: ${text}`}
      className='flex gap-1 items-center px-2 py-1 rounded-full border text-nav text-sm cursor-pointer bg-light border-nav'
    >

      {text}
      <span aria-hidden="true"><X size={16} /></span>
    </button>
  )
}

export default FilterTag
