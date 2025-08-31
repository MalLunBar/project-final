import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import FocusLock from "react-focus-lock"
import { X } from 'lucide-react'
import LoginForm from "../components/LoginForm"
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'


const LoginModal = ({ onClose }) => {
  // Modal-meddelande
  const loginMessage = useModalStore(s => s.loginMessage)

  // previously focused element before opening modal
  const openerRef = useRef(null)

  // Auth store (välj fält separat)
  const login = useAuthStore(s => s.login)
  const isLoading = useAuthStore(s => s.isLoading)
  const authError = useAuthStore(s => s.error)
  const clearAuthError = useAuthStore(s => s.clearError)

  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  // clear error and move focus when component mounts
  useEffect(() => {
    setFormError("")
    setFieldErrors({})
    clearAuthError?.()
    // save the previously focused element before opening modal
    openerRef.current = document.activeElement
  }, [])

  const handleClose = () => {
    openerRef.current?.focus() // return focus to the button that opened the modal
    onClose()
  }


  const handleLogin = async (email, password) => {
    setFormError("")
    setFieldErrors({})

    const nextFieldErrors = {}
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) nextFieldErrors.email = "Ange din e-postadress."
    else if (!emailRe.test(email)) nextFieldErrors.email = "Ogiltig e-postadress."
    if (!password) nextFieldErrors.password = "Ange ditt lösenord."

    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors)
      return
    }

    try {
      await login({ email, password })
      handleClose()
    } catch (e) {
      // Prefer a general form error for bad credentials
      setFormError("Fel e-post eller lösenord.")
    }
  }

  const displayFormError = formError || authError || ''

  return (
    <div
      role='dialog'
      aria-labelledby='login'
      className='fixed inset-0 z-1200 flex items-center justify-center'
    >
      {/* Backdrop overlay (page behind is dimmed) */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      />
      {/* Modal box */}
      <FocusLock>
        <div className="relative flex flex-col gap-10 bg-white rounded-xl shadow-xl p-10 w-full max-w-md z-10">
          {/* Modal title */}
          <h2 className='text-xl font-semibold'>Logga in</h2>

          {/* Show optional message */}
          {loginMessage && (
            <div className="-my-4 px-4 py-2 bg-yellow-100 text-yellow-800 text-sm">
              {loginMessage}
            </div>
          )}

          {/* Login form */}
          <LoginForm 
            id="login-form" 
            onSubmit={handleLogin} 
            isLoading={isLoading}
            error={displayFormError}
            fieldErrors={fieldErrors}
            autoFocus 
          />

          {/* Link to signup page */}
          <span className='flex self-center gap-2 text-sm text-gray-600'>
            <p>Har du inget konto? </p>
            <Link
              to='/signup'
              className='text-accent hover:underline'
              onClick={handleClose}
            >
              Registrera dig här
            </Link>
          </span>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-5 cursor-pointer text-gray-500 hover:text-black"
            aria-label="Stäng inloggningsruta"
          >
            <X />
          </button>
        </div>
      </FocusLock>
    </div>
  )
}

export default LoginModal