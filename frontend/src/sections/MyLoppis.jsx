import { useState, useEffect } from 'react'
import LoppisList from "../components/LoppisList"
import EditModal from "../modals/EditModal"
import ConfirmDialog from '../components/ConfirmDialog'
import useAuthStore from "../stores/useAuthStore"
import { getUserLoppis } from '../services/usersApi'
import { deleteLoppis } from '../services/loppisApi'

const MyLoppis = () => {
  const { user, token } = useAuthStore()
  const [loppisList, setLoppisList] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
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

    const fetchloppisList = async () => {
      setLoading(true)
      setError(null)
      setEmptyMsg("")
      try {
        const data = await getUserLoppis(user.id, token)
        if (!data || data.length === 0) {
          setEmptyMsg('Du har inga loppisar ännu.')
        }
        setLoppisList(data)
      } catch (err) {
        // --------------------TODO: handle error appropriately
        console.error('Failed to fetch loppis data:', err)
        setError(err.message || 'Kunde inte hämta loppisdata')
      } finally {
        setLoading(false)
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
      await deleteLoppis(l._id, token)
      // optimistically remove from list
      setLoppisList(prev => prev.filter(item => item._id !== l._id))
    } catch (err) {
      // --------------------TODO: handle error appropriately
      console.error('Failed to delete loppis: ', err)
      setError(err.message || 'Kunde inte radera loppis')
    } finally {
      setDeletingId(null)
      setConfirmLoppis(null)
    }
  }

  return (
    <section>

      {error && <p className="text-red-500">{error}</p>}
      {!error && loppisList?.length > 0 && (
        <LoppisList
          loppisList={loppisList}
          variant="profile"
          allowEditing
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