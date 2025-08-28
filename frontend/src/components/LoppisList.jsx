import { useState } from 'react'
import { PencilLine, Trash2, Loader2, Check } from 'lucide-react'
import LoppisCard from "./LoppisCard"
import Button from './Button'

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
  // används fför att knapparna inte ska vara fokuserbara när de är gömda
  const isActionsVisible = variant === 'profile' && allowEditing && isEditing

  const listClass =
    variant === 'profile'
      // 1 kolumn (mobil) → 2 (padda/md) → 3 (desktop/lg)
      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center items-stretch w-full'
      : 'flex flex-col gap-4 w-full'

  // Grid-item: låt varje item bli en flex-rad (kort + actions-kolumn)
  const itemClass =
    variant === 'profile'
      ? 'relative flex items-stretch gap-2 w-full'
      : 'flex items-stretch gap-2 relative w-full'
  return (
    <section className='flex p-2 flex-col gap-4 items-center w-full'>

      {variant === 'profile' && allowEditing && hasCards && (
        <div className='flex self-end mb-1'>

          <Button
            onClick={() => setIsEditing(v => !v)}
            icon={isEditing ? Check : PencilLine}
            ariaLabel={isEditing ? 'Avsluta redigering' : 'Redigera lista'}
            type="button"
            text={isEditing ? 'Klart' : 'Redigera'}
            title={isEditing ? 'Klart' : 'Redigera'}
            aria-pressed={isEditing}
          />
        </div>
      )}

      <div>
        <ul className={listClass}>
          {loppisList.map((loppis, index) => (
            <li key={index} className={itemClass}>
              {/* KORTET: glid lite vänster när editeringsläge är på */}
              <div className={`transition-transform duration-300 ease-out ${variant === 'profile' && allowEditing && isEditing ? '-translate-x-2' : ''}`}>
                <LoppisCard
                  loppis={loppis}
                  variant={variant}
                  className="h-full justify-items-center"
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
                    className="p-2 rounded-3xl bg-white opacity-75 hover:opacity-90 focus:outline-none"
                    aria-label="Redigera"
                    title="Redigera"
                    disabled={!isActionsVisible || Boolean(deletingId)}
                    tabIndex={isActionsVisible ? 0 : -1}
                  >
                    <PencilLine
                      size={30}
                    />
                  </button>

                  {/* Soptunna under */}
                  <button
                    onClick={() => onDeleteCard?.(loppis)}
                    aria-busy={deletingId === loppis._id}      // markera aktiv rad
                    className="p-2 rounded-3xl bg-white opacity-75 hover:opacity-90 focus:outline-none"
                    aria-label="Ta bort"
                    title="Ta bort"
                    disabled={!isActionsVisible || Boolean(deletingId)}
                    tabIndex={isActionsVisible ? 0 : -1}
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
      </div>

    </section>
  )
}

export default LoppisList