import { useState } from 'react'
import { PencilLine, Trash2 } from 'lucide-react'
import LoppisCard from "./LoppisCard"

const LoppisList = ({
  loppisList,
  variant = 'search',           // 'search' | 'map' | 'profile'
  onEditCard,                    // profile
  onDeleteCard,                  // profile
  onMapCardClose,                // map: stäng popup

}) => {

  const [isEditing, setIsEditing] = useState(false)
  const hasCards = Array.isArray(loppisList) && loppisList.length > 0

  return (
    <section className='flex p-2 flex-col gap-2'>

      {variant === 'profile' && hasCards && (
        <div className='flex justify-end mb-1'>
          <button
            onClick={() => setIsEditing(v => !v)}
            className='inline-flex items-center gap-2 px-3 py-2 border rounded-lg bg-white hover:bg-gray-50'
            aria-label={isEditing ? 'Avsluta redigering' : 'Redigera lista'}
            title={isEditing ? 'Klart' : 'Redigera'}
          >
            <PencilLine className='w-4 h-4' />
            <span className='text-sm'>{isEditing ? 'Klart' : 'Redigera'}</span>
          </button>
        </div>
      )}


      <ul className='flex flex-col gap-2'>
        {loppisList.map((loppis, index) => (
          <li
            key={index}
            className='flex items-stretch gap-2'>
            <LoppisCard
              loppis={loppis}
              variant={variant}
              showItemActions={variant === 'profile' && isEditing}
              onEdit={onEditCard}
              onClose={onMapCardClose}
            />

            {/* PROFILE: papperskorg till höger om varje kort när redigeringsläge är på */}
            {variant === 'profile' && isEditing && (
              <button
                onClick={() => onDeleteCard?.(loppis)}
                className='self-start p-2 border rounded-md bg-white hover:bg-gray-50'
                aria-label='Ta bort'
                title='Ta bort'
              >
                <Trash2 className='w-4 h-4' />
              </button>
            )}
          </li>
        ))}
      </ul>

    </section>
  )
}

export default LoppisList