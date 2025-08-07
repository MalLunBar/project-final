import { X } from 'lucide-react'
import UserForm from "../components/UserForm"
import useAuthStore from '../stores/useAuthStore'

const LoginModal = ({ onClose }) => {
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
        // --------------TODO: Show error message in the UI
        return
      }
      const currentUser = data.response
      console.log("inloggningen lyckades! Användare: ", currentUser)
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
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 cursor-pointer text-gray-500 hover:text-black"
        >
          <X />
        </button>
        {/* Login form */}
        <UserForm type='login' onSubmit={handleLogin}></UserForm>
      </div>
    </div>
  )
}

export default LoginModal