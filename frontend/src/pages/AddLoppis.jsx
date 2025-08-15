// src/pages/AddLoppis.jsx
import useAuthStore from '../stores/useAuthStore'
import LoppisForm from '../components/LoppisForm'

const AddLoppis = () => {
  const user = useAuthStore(s => s.user)
  const userId = user?._id ?? user?.id

  const addLoppis = async (fd) => {
    if (!userId) throw new Error('Ingen användare')

    // 1) Läs befintlig payload ("data"), lägg till createdBy och skriv tillbaka
    const raw = fd.get('data')
    const base = raw ? JSON.parse(raw) : {}
    const next = { ...base, createdBy: userId }

    fd.delete('data')
    fd.append('data', JSON.stringify(next))

    // 2) Skicka som multipart/form-data (låter browser sätta Content-Type + boundary)
    const res = await fetch('http://localhost:8080/loppis', {
      method: 'POST',
      body: fd,
      // headers: { Authorization: `Bearer ${token}` } // om du har auth-token
    })


    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.success) throw new Error(data.message || 'Misslyckades')
    // TODO: ev. redirect / toast
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
    <LoppisForm
      initialValues={blank}
      submitLabel='Lägg till loppis'
      title='Lägg till en loppis'
      onSubmit={addLoppis}
    />
  )
}

export default AddLoppis
