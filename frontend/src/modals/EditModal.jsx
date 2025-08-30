// src/components/EditLoppisModal.jsx
import { X } from 'lucide-react'
import LoppisForm from '../components/LoppisForm'
import { updateLoppis } from '../services/loppisApi'
import useAuthStore from '../stores/useAuthStore'

const EditModal = ({ open, loppis, onClose, onSaved }) => {
  const { token } = useAuthStore()
  if (!open || !loppis) return null

  const editLoppis = async (payload) => {
    try {
      // payload ÄR FormData från LoppisForm
      const updated = await updateLoppis(loppis._id, payload, token)
      onSaved?.(updated)
    } catch (err) {
      console.error('Failed to update loppis:', err)
    }
  }

  return (
    <div className='fixed inset-0 z-1100 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='relative z-10 max-w-3xl w-[94vw] md:w-[720px] rounded-2xl bg-white shadow-xl'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h3 className='text-lg font-semibold'>Redigera loppis</h3>
          <button
            onClick={onClose}
            className='p-2 rounded-md bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer'
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
            onSubmit={editLoppis}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  )
}

export default EditModal
