import { X } from 'lucide-react'
import UserForm from "../components/UserForm"

const LoginModal = ({ onClose }) => {

  const handleLogin = () => {
    console.log("logging in")
    onClose()
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

        <button
          onClick={onClose}
          className="absolute top-4 right-5 cursor-pointer text-gray-500 hover:text-black"
        >
          <X />
        </button>
        <UserForm type='login' onSubmit={handleLogin}></UserForm>
      </div>

    </div>
  )
}

export default LoginModal