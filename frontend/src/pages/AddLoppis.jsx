// src/pages/AddLoppis.jsx
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'
import { createLoppis } from '../services/loppisApi'
import LoppisForm from '../components/LoppisForm'

const AddLoppis = () => {
  const { user, token } = useAuthStore()
  const userId = user?._id ?? user?.id
  const navigate = useNavigate()

  const addLoppis = async (fd) => {
    try {
      // 1) Läs befintlig payload ("data"), lägg till createdBy och skriv tillbaka
      const raw = fd.get('data')
      const base = raw ? JSON.parse(raw) : {}
      const next = { ...base, createdBy: userId }

      fd.delete('data')
      fd.append('data', JSON.stringify(next))

      // 2) Skicka som multipart/form-data (låter browser sätta Content-Type + boundary)
      const newLoppis = await createLoppis(fd, token)
      if (!newLoppis || !newLoppis._id) {
        throw new Error('Misslyckades att skapa loppis')
      }
      // re-direct to the loppis details page
      navigate(`/loppis/${newLoppis._id}`)
    } catch (err) {
      // --------------------TODO: handle error appropriately
      console.error('Failed to create loppis:', err)
    } finally {
      // -------------------TODO: handle loading state
    }
  }

  const blank = {
    title: '',
    description: '',
    categories: [],
    dates: [{ date: '', startTime: '', endTime: '' }],
    location: { address: { street: '', city: '', postalCode: '' } },
    images: [] // valfritt; LoppisForm/PhotoDropzone bryr sig inte om tom array
  }

  return (
    <main className='py-6 px-4'>
      <LoppisForm
        initialValues={blank}
        submitLabel='Lägg till loppis'
        title='Lägg till en loppis'
        onSubmit={addLoppis}
      />
    </main>
  )
}

export default AddLoppis
