import { useState, useEffect } from 'react'
import LoppisList from "../components/LoppisList"
import EditModal from "../modals/EditModal"
import ConfirmDialog from '../components/ConfirmDialog'
import useAuthStore from "../stores/useAuthStore"

const MyLoppis = () => {
  const { user, token } = useAuthStore()
  const [loppisList, setLoppisList] = useState([])
  const [error, setError] = useState(null)
  const [emptyMsg, setEmptyMsg] = useState("")
  const [editingLoppis, setEditingLoppis] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmLoppis, setConfirmLoppis] = useState(null)

  useEffect(() => {
    if (!user || !token) {
      setError("Du måste vara inloggad för att se dina loppisar.")
      return
    }

    const fetchUrl = new URL("http://localhost:8080/loppis/user")

    const fetchloppisList = async () => {
      try {
        setError(null)
        setEmptyMsg("")

        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: { 'Authorization': token }
        })

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
        if (data.response.length === 0) {
          setEmptyMsg("Du har inga loppisar än.")
        }

      } catch (error) {
        setError(error.message || "Ett okänt fel inträffade.")
      }
    }
    fetchloppisList()
  }, [user])

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
    if (deletingId) return               // blockera parallella deletes
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
    <section>
      <h3>Mina Loppisar</h3>

      {error && <p className="text-red-500">{error}</p>}
      {!error && loppisList?.length > 0 && (
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


      {!error && loppisList?.length === 0 && <p>{emptyMsg || "Du har inga loppisar än."}</p>}

      {/* Edit-popup */}
      <EditModal
        open={isEditOpen}
        loppis={editingLoppis}
        onClose={closeEdit}
        onSaved={applySaved}
      />
    </section>
  )
}

export default MyLoppis