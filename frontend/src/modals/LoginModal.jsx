import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import LoginForm from "../components/LoginForm"
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'

const LoginModal = ({ onClose }) => {
  const loginMessage = useModalStore(state => state.loginMessage)
  const login = useAuthStore(state => state.login)
  const url = "http://localhost:8080/users/login" // local api

  const handleLogin = async (email, password) => {
    console.log("logging in")
    console.log('email and password from login modal:', email, password)
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()
      if (!response.ok) {
        console.error("Login failed. Please check you email and password and try again.")
        // --------------TODO: Show error message in the UI -----------
        return
      }
      const currentUser = data.response
      console.log("inloggningen lyckades! Inloggad användare: ", currentUser.firstName)
      // save in Zustand
      login({ id: currentUser.id, name: currentUser.firstName }, currentUser.accessToken)
      localStorage.setItem('token', data.token); // optional
      // close modal
      onClose()
    } catch (error) {
      console.error('Login error:', err)
    }
  }

  return (
    <div
      role='dialog'
      aria-labelledby='login'
      className='fixed inset-0 z-50 flex items-center justify-center'
    >
      {/* Backdrop overlay (page behind is dimmed) */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      />
      {/* Modal box */}
      <div className="relative flex flex-col gap-10 bg-background rounded-xl shadow-xl py-14 px-10  w-full max-w-md z-10">
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

        {/* Login form */}
        <LoginForm type='login' onSubmit={handleLogin} />
        {/* Link to signup page */}
        <span className='flex gap-1 self-center text-sm text-gray-600'>
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