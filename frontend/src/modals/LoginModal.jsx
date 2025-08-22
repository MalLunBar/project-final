import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import LoginForm from "../components/LoginForm"
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'

const LoginModal = ({ onClose }) => {
  const loginMessage = useModalStore(state => state.loginMessage)
  const { login, isLoading, error, clearError } = useAuthStore()

  // clear error when component mounts
  useEffect(() => {
    clearError()
  }, [])

  const handleLogin = async (email, password) => {
    try {
      // call login function from auth store
      await login({ email, password })
      // close modal
      onClose()
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <div
      role='dialog'
      aria-labelledby='login'
      className='fixed inset-0 z-1200 flex items-center justify-center'
    >
      {/* Backdrop overlay (page behind is dimmed) */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      />
      {/* Modal box */}
      <div className="relative flex flex-col gap-10 bg-white rounded-xl shadow-xl py-5 px-10  w-full max-w-md z-10">
        {/* Modal title */}
        <h2>Logga in</h2>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 cursor-pointer text-gray-500 hover:text-black"
        >
          <X />
        </button>
        {/* Show optional message */}
        {loginMessage && (
          <div className="my-4 px-4 py-2 bg-yellow-100 text-yellow-800 text-sm">
            {loginMessage}
          </div>
        )}
        {/* Show error message if login fails */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        {/* Login form */}
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

        {/* Link to signup page */}
        <span className='flex self-center text-sm text-gray-600'>
          <p>Har du inget konto? </p>
          <Link
            to='/signup'
            className='text-accent hover:underline'
            onClick={onClose}
          >
            Registrera dig här
          </Link>
        </span>
      </div>
    </div>
  )
}

export default LoginModal