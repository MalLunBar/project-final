// src/pages/ProtectedPage.jsx
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'

const ProtectedPage = ({ children, message = 'Du behöver vara inloggad.' }) => {
  // Läs bara det du behöver via selector
  const user = useAuthStore(s => s.user)

  // Vänta på rehydrering från zustand/persist (viktigt vid direkt-URL)
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist?.hasHydrated?.() ?? true)
  useEffect(() => {
    const unsub = useAuthStore.persist?.onFinishHydration?.(() => setHydrated(true))
    return () => unsub?.()
  }, [])

  if (!hydrated) return null // eller en liten skeleton/spinner

  if (!user) return <Navigate to="/" replace />
  return children
}

export default ProtectedPage
