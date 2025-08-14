// src/pages/AddLoppis.jsx
import useAuthStore from '../stores/useAuthStore'
import LoppisForm from '../components/LoppisForm'

const AddLoppis = () => {
  const user = useAuthStore(s => s.user)
  const userId = user?._id ?? user?.id

  const addLoppis = async (payload) => {
    if (!userId) throw new Error('Ingen användare')
    const res = await fetch('http://localhost:8080/loppis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, createdBy: userId }),
    })
    const data = await res.json()
    if (!res.ok || !data.success) throw new Error(data.message || 'Misslyckades')
    // TODO: ev. redirect / toast
  }

  const blank = {
    title: '', description: '',
    categories: [],
    dates: [{ date: '', startTime: '', endTime: '' }],
    location: { address: { street: '', city: '', postalCode: '' } }
  }

  return (
    <LoppisForm
      initialValues={blank}
      submitLabel='Lägg till loppis'
      title='Lägg till en loppis'
      onSubmit={addLoppis}
    />
  )
}

export default AddLoppis
