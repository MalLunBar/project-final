import { useState } from 'react'
import { PencilLine, Trash2, Loader2 } from 'lucide-react'
import LoppisCard from "./LoppisCard"

const LoppisList = ({
  loppisList,
  variant = 'search',           // 'search' | 'map' | 'profile'
  onEditCard,                    // profile
  onDeleteCard,                  // profile
  onMapCardClose,                // map: stäng popup
  deletingId = null,
  allowEditing = false,
}) => {

  const [isEditing, setIsEditing] = useState(false)
  const hasCards = Array.isArray(loppisList) && loppisList.length > 0

  // Containerklasser
  const listClass =
    variant === 'profile'
      ? 'flex flex-col items-center gap-4 w-full lg:flex-row lg:flex-wrap lg:items-stretch lg:justify-start'
      : 'flex flex-col gap-4 w-full'

  // Item-bredd: 100% på mobil, 50% på lg 
  const itemClass =
    variant === 'profile'
      ? 'relative flex items-center gap-2 w-full max-w-[420px] sm:max-w-[520px] md:max-w-[560px] mx-auto lg:mx-0 lg:max-w-none lg:flex-[0_0_calc(50%-0.5rem)]'
      : 'flex items-stretch gap-2 relative w-full'

  return (
    <section className='flex p-2 flex-col gap-4 items-center w-full'>

      {variant === 'profile' && allowEditing && hasCards && (
        <div className='flex self-end mb-1'>

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


      <ul className={listClass}>
        {loppisList.map((loppis, index) => (
          <li key={index} className={itemClass}>
            {/* KORTET: glid lite vänster när editeringsläge är på */}
            <div className={`transition-transform duration-300 ease-out ${variant === 'profile' && allowEditing && isEditing ? '-translate-x-2' : ''}`}>
              <LoppisCard
                loppis={loppis}
                variant={variant}
                showItemActions={variant === 'profile' && allowEditing && isEditing}
                onEdit={onEditCard}
                onClose={onMapCardClose}
              />
            </div>

            {/* ACTIONS-KOLUMN: alltid monterad -> kan animeras in/ut */}
            <div
              aria-hidden={!(variant === 'profile' && allowEditing && isEditing)}
              className={`self-stretch transition-all duration-300 ease-out
              ${variant === 'profile' && allowEditing
                  ? (isEditing
                    ? 'w-12 opacity-100 translate-x-0'
                    : 'w-0 opacity-0 -translate-x-2 pointer-events-none')
                  : 'hidden'}`}
            >
              <div className="flex flex-col justify-center items-center gap-2 h-full">
                {/* Penna ovanför */}
                <button
                  onClick={() => onEditCard?.(loppis)}
                  className="p-2 rounded-3xl bg-white opacity-60 hover:opacity-90 focus:outline-none"
                  aria-label="Redigera"
                  title="Redigera"
                >
                  <PencilLine
                    size={30}
                  />
                </button>

                {/* Soptunna under */}
                <button
                  onClick={() => onDeleteCard?.(loppis)}
                  disabled={Boolean(deletingId)}             // disable ALLA när en är igång
                  aria-busy={deletingId === loppis._id}      // markera aktiv rad
                  className="p-2 rounded-3xl bg-white opacity-60 hover:opacity-90 focus:outline-none"
                  aria-label="Ta bort"
                  title="Ta bort"
                >

                  {deletingId === loppis._id
                    ? <Loader2 className="animate-spin" size={18} />
                    : <Trash2 size={30} />}
                </button>
              </div>
            </div>
          </li>

        ))}
      </ul>

    </section>
  )
}

export default LoppisList