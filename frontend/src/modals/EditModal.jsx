// src/components/EditLoppisModal.jsx
import { X } from 'lucide-react'
import LoppisForm from '../components/LoppisForm'

const EditModal = ({ open, loppis, onClose, onSaved }) => {
  if (!open || !loppis) return null

  const updateLoppis = async (payload) => {
    // Justera endpoint/metod om ditt API använder PATCH el. annan path
    const res = await fetch(`http://localhost:8080/loppis/${loppis._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok || !data.success) throw new Error(data.message || 'Misslyckades')
    onSaved?.(data.response)   // skicka tillbaka uppdaterad loppis
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='relative z-10 max-w-3xl w-[94vw] md:w-[720px] rounded-2xl bg-white shadow-xl'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h3 className='text-lg font-semibold'>Redigera loppis</h3>
          <button
            onClick={onClose}
            className='p-2 rounded-md bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300'
            aria-label='Stäng'
            title='Stäng'
          >
            <X size={20} />
          </button>
        </div>

        {/* Body: formulär */}
        <div className='max-h-[80vh] overflow-y-auto p-2'>
          <LoppisForm
            initialValues={loppis}
            submitLabel='Spara'
            title=''
            onSubmit={updateLoppis}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  )
}

export default EditModal
