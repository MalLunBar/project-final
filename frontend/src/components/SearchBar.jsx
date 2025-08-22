import { Search } from 'lucide-react'

const SearchBar = ({ value, setValue }) => {
  return (
    <div className="flex items-center bg-white border border-border rounded-3xl px-4 py-2 shadow-md w-full max-w-lg">
      <input
        type="text"
        placeholder="Sök stad eller område..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='flex-grow bg-transparent focus:outline-none text-base md:text-lg'
      />
      <button
        type='submit'
        className='cursor-pointer text-accent hover:text-accent-dark ml-2'
        aria-label='Sök'
      >
        <Search size={26} strokeWidth={3} />
      </button>
    </div>
  )
}

export default SearchBar