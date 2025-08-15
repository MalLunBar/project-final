import { X } from 'lucide-react'

const FilterTag = ({ text, onClose }) => {
  return (
    <div
      className='flex gap-1 items-center px-2 py-1 rounded-full border text-nav text-sm cursor-pointer bg-light border-nav'
    >
      {text}
      <X size={16} onClick={onClose} />
    </div>
  )
}

export default FilterTag
