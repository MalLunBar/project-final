
import { useState, useEffect } from "react"
import useAuthStore from "../stores/useAuthStore"
import LoppisList from "../components/LoppisList"
import EditModal from "../modals/EditModal"
import ConfirmDialog from '../components/ConfirmDialog'

const Profile = ({ name }) => {

  const user = useAuthStore((s) => s.user)           // läs direkt från store
  const userId = user?._id ?? user?.id               // funkar oavsett id/_id

  const [loppisList, setLoppisList] = useState([])
  const [error, setError] = useState(null)
  const [emptyMsg, setEmptyMsg] = useState("")
  const [editingLoppis, setEditingLoppis] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmLoppis, setConfirmLoppis] = useState(null)


  useEffect(() => {
    if (!userId) return

    const fetchUrl = new URL("http://localhost:8080/loppis/user")
    fetchUrl.searchParams.set("userId", String(userId))

    const fetchloppisList = async () => {
      try {
        setError(null)
        setEmptyMsg("")

        const response = await fetch(fetchUrl)


        if (response.status === 404) {
          setLoppisList([])
          setEmptyMsg("Inga loppisar hittades för denna användare.")
          return
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.message || "Något gick fel vid hämtning av loppisList.")
        }

        const data = await response.json()
        setLoppisList(Array.isArray(data.response) ? data.response : [])

      } catch (error) {
        setError(error.message || "Ett okänt fel inträffade.")
      }
    }
    fetchloppisList()
  }, [userId])

  //Öppna, stäng editmodal och spara loppis
  const openEdit = (loppis) => {
    setEditingLoppis(loppis)
    setIsEditOpen(true)
  }
  const closeEdit = () => {
    setIsEditOpen(false)
    setEditingLoppis(null)
  }

  const applySaved = (updated) => {
    setLoppisList(prev => prev.map(item => item._id === updated._id ? updated : item))
    closeEdit()
  }

  //Ta bort Loppis
  const handleDelete = async (l) => {
    if (deletingId) return                         // blockera parallella deletes
    setDeletingId(l._id)
    try {
      const res = await fetch(`http://localhost:8080/loppis/${l._id}`, { method: 'DELETE' })
      const text = await res.text()                // undvik JSON-parse på ev. HTML
      if (!res.ok) throw new Error(text || res.statusText)

      setLoppisList(prev => prev.filter(item => item._id !== l._id))
    } catch (e) {
      alert('Kunde inte ta bort. Försök igen.')
      console.error(e)
    } finally {
      setDeletingId(null)
      setConfirmLoppis(null)
    }
  }

  return (
    <section className="bg-[url(./monstera.jpg)] bg-center bg-no-repeat bg-cover bg-white/0 bg-blend-screen p-4">
      <h2 className="text-white font-bold">Hello, {name}</h2>

      <h3 className="text-white">Mina Loppisar</h3>
      {error && <p className="text-red-500">{error}</p>}
      {!error && loppisList.length > 0 && (
        <LoppisList
          loppisList={loppisList}
          variant="profile"
          onEditCard={openEdit}
          onDeleteCard={(l) => setConfirmLoppis(l)}
          deletingId={deletingId}
        />

      )}

      <ConfirmDialog
        open={Boolean(confirmLoppis)}
        title="Ta bort loppis"
        message={
          confirmLoppis
            ? `Är du säker på att du vill ta bort "${confirmLoppis.title}"?`
            : 'Är du säker på att du vill ta bort den här loppisen?'
        }
        confirmText="Ja"
        cancelText="Nej"
        loading={deletingId === confirmLoppis?._id}
        onCancel={() => setConfirmLoppis(null)}
        onConfirm={() => handleDelete(confirmLoppis)}
      />


      {!error && loppisList.length === 0 && <p>{emptyMsg || "Du har inga loppisar än."}</p>}

      {/* Edit-popup */}
      <EditModal
        open={isEditOpen}
        loppis={editingLoppis}
        onClose={closeEdit}
        onSaved={applySaved}
      />

      <h3>Mina Favoriter</h3>
      {/*Array av LoppisCard*/}
    </section>
  )
}


export default Profile