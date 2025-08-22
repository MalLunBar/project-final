import { Navigate } from "react-router-dom"
import useAuthStore from '../stores/useAuthStore'

const ProtectedPage = ({ children }) => {
  const { isLoggedIn } = useAuthStore()
  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }
  return children
}

export default ProtectedPage