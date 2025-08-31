import LoppisForm from '../components/LoppisForm'
import { updateLoppis } from '../services/loppisApi'
import useAuthStore from '../stores/useAuthStore'
import useLoppisUpdateStore from '../stores/useLoppisUpdateStore'

const EditModal = ({ open, loppis, onClose, onSaved }) => {
  const { token } = useAuthStore()
  const { setUpdating } = useLoppisUpdateStore()
  if (!open || !loppis) return null

  const editLoppis = async (payload) => {
    try {
      // payload ÄR FormData från LoppisForm
      setUpdating(loppis._id, true)
      const updated = await updateLoppis(loppis._id, payload, token)
      onSaved?.(updated)
    } catch (err) {
      console.error('Failed to update loppis:', err)
    } finally {
      setUpdating(loppis._id, false)

    }
  }

  return (
    <div className='fixed inset-0 z-1100 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />


      {/* Body: formulär */}
      <div className='max-h-[80vh] overflow-y-auto p-2'>
        <LoppisForm
          initialValues={loppis}
          submitLabel='Spara'
          title='Registrera din loppis'
          onSubmit={editLoppis}
          onCancel={onClose}
        />
      </div>
    </div>

  )
}

export default EditModal
