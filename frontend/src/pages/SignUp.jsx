import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'
import Input from "../components/Input"
import Button from "../components/Button"
import image from '../assets/botanical.jpg'

const SignUp = () => {
  const { register, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  })
  const navigate = useNavigate()

  // clear error when component mounts
  useEffect(() => {
    clearError()
  }, [])

  // handle form submission
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
    <main
      id="main-content" tabIndex={-1}
      className="w-full min-h-[calc(100vh-64px) md:min-h-[calc(100vh-72px)] bg-center bg-no-repeat bg-cover flex items-center px-2 py-6"
      style={{ backgroundImage: `url(${image})` }}>
      <section
        className="flex flex-col gap-4 mx-auto max-w-2xl px-2 py-4 md:p-12 rounded-xl shadow-2xl bg-white/90"
      >
        <div>
          <h2 className="text-xl font-semibold">Registrera dig</h2>
        </div>

        {/* Ändra de som behöver vara rerquired senare */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4">

          <fieldset className="flex p-2 flex-col gap-4 pb-6">
            <legend className="font-semibold text-lg pb-2">Dina uppgifter</legend>

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
              <div
                className="mt-1 rounded-2xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

          </fieldset>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="submit"
              text={isLoading ? "Skapar konto…" : "Registrera"}
              ariaLabel="Registrera"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="secondary"
              text="Avbryt"
              onClick={() => navigate(-1)}
            />
          </div>
        </form>
      </section>
    </main>
  )
}

export default SignUp