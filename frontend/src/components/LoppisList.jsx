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
              <div className="flex flex-col justify-center items-center gap-4 self-stretch">
                {/* NY penna ovanför soptunnan (utan border) */}
                <button
                  onClick={() => onEditCard?.(loppis)}
                  className="p-2 rounded-md bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Redigera"
                  title="Redigera"
                >
                  <PencilLine size={20} />
                </button>

                {/* Soptunna (utan border, större ikon) */}
                <button
                  onClick={() => onDeleteCard?.(loppis)}
                  className="p-2 rounded-md bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Ta bort"
                  title="Ta bort"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

    </section>
  )
}

export default LoppisList