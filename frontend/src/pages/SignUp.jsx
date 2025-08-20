import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'
import Input from "../components/Input"
import Button from "../components/Button"

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  })

  const register = useAuthStore(state => state.login)
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      // call register function from auth store
      await register({
        firstName: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })
      // clear form data after successful registration
      setFormData({
        name: "",
        lastName: "",
        email: "",
        password: "",
      })
      // redirect to home page
      navigate('/')
    } catch (err) {
      console.error("Något gick fel vid registrering:", err)
    }
  }

  return (
    <article>
      <div>
        <h2 className="font-bold">Registrera dig</h2>
      </div>

      {/* Ändra de som behöver vara rerquired senare */}
      <form
        onSubmit={handleSubmit}
        className="">
        <Input
          id='signup-name'
          type='text'
          label='Förnamn'
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          value={formData.name}
          showLabel={true}
          required={true}
        />
        <Input
          id='signup-lastname'
          type='text'
          label='Efternamn'
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          value={formData.lastName}
          showLabel={true}
          required={true}
        />
        <Input
          id='signup-email'
          type='email'
          label='Email'
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          value={formData.email}
          showLabel={true}
          required={true}
        />
        <Input
          id='signup-password'
          type='password'
          label='Lösenord'
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          value={formData.password}
          showLabel={true}
          required={true}
        />
        {/* Show error message if register fails */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
        <Button
          type="submit"
          text={isLoading ? 'Registrerar...' : 'Registrera'}
          ariaLabel="Registrera">
        </Button>
      </form>
    </article>
  )
}

export default SignUp