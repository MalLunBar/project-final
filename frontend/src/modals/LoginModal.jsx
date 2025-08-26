import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import LoginForm from "../components/LoginForm"
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'
import ErrorBanner from "../components/ErrorBanner"

const LoginModal = ({ onClose }) => {
  // Modal-meddelande
  const loginMessage = useModalStore(s => s.loginMessage)

  // Auth store (välj fält separat)
  const login = useAuthStore(s => s.login)
  const isLoading = useAuthStore(s => s.isLoading)
  const authError = useAuthStore(s => s.error)
  const clearAuthError = useAuthStore(s => s.clearError)

  const [localError, setLocalError] = useState(null)

  // clear error when component mounts
  useEffect(() => {
    setLocalError(null)
    clearAuthError?.()
  }, [])


  const handleLogin = async (email, password) => {

    setLocalError(null)
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return setLocalError('Ange din e-postadress.')
    if (!emailRe.test(email)) return setLocalError('Ogiltig e-postadress.')
    if (!password) return setLocalError('Ange ditt lösenord.')
    // if (password.length < 6) return setLocalError('Lösenordet måste vara minst 6 tecken.')

    try {
      // call login function from auth store
      await login({ email, password })
      console.log('[UI] login done. store state:', useAuthStore.getState())
      // close modal
      onClose()
    } catch (e) {
      setLocalError('Fel e-post eller lösenord.')
    }
  }

  const displayErrorText = localError || authError || null

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
      <div className="relative flex flex-col gap-10 bg-white rounded-xl shadow-xl p-10 w-full max-w-md z-10">
        {/* Modal title */}
        <h2 className='text-xl font-semibold'>Logga in</h2>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 cursor-pointer text-gray-500 hover:text-black"
        >
          <X />
        </button>

        {/* Show optional message */}
        {loginMessage && (
          <div className="-my-4 px-4 py-2 bg-yellow-100 text-yellow-800 text-sm">
            {loginMessage}
          </div>
        )}

        {displayErrorText && (
          <ErrorBanner onClose={() => {
            setLocalError(null)
            clearAuthError?.()
          }}>
            {displayErrorText}
          </ErrorBanner>
        )}

        {/* Login form */}
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

        {/* Link to signup page */}
        <span className='flex self-center gap-2 text-sm text-gray-600'>
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