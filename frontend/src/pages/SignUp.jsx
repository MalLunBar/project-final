import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'
import Input from "../components/Input"
import Button from "../components/Button"
import image from '../assets/seeds-1.jpg'
import ErrorMessage from "../components/ErrorMessage"
import FieldError from "../components/FieldError"
import { errorMessage } from "../utils/errorMessage"

const SignUp = () => {
  const { register, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  })

  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()

  // clear error when component mounts
  useEffect(() => {
    clearError()
  }, [])

  // --- validation helpers ---
  const validateField = (key, val) => {
    const v = String(val || "").trim()
    switch (key) {
      case "name":
        if (!v) return "Förnamn är obligatoriskt."
        if (v.length < 2) return "Förnamn måste vara minst 2 tecken."
        return ""
      case "lastName":
        if (!v) return "Efternamn är obligatoriskt."
        if (v.length < 2) return "Efternamn måste vara minst 2 tecken."
        return ""
      case "email": {
        if (!v) return "E-post är obligatoriskt."
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        return ok ? "" : "Ange en giltig e-postadress."
      }
      case "password":
        if (!v) return "Lösenord är obligatoriskt."
        if (v.length < 8) return "Lösenord måste vara minst 8 tecken."
        return ""
      default:
        return ""
    }
  }

  const validateAll = (data) => {
    const next = {
      name: validateField("name", data.name),
      lastName: validateField("lastName", data.lastName),
      email: validateField("email", data.email),
      password: validateField("password", data.password),
    }
    setErrors(next)
    return next
  }

  const onBlur = (key) => (e) => {
    setTouched((t) => ({ ...t, [key]: true }))
    setErrors((prev) => ({ ...prev, [key]: validateField(key, e.target.value) }))
  }

  const onChange = (key) => (e) => {
    const val = e.target.value
    setFormData((d) => ({ ...d, [key]: val }))
    // live-clear an existing error once user fixes it
    if (touched[key]) {
      setErrors((prev) => ({ ...prev, [key]: validateField(key, val) }))
    }
  }

  // handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()

    const fieldErrors = validateAll(formData)
    const hasErrors = Object.values(fieldErrors).some(Boolean)
    if (hasErrors) return

    try {
      // call register function from auth store
      await register({
        firstName: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })
      // clear form data after successful registration
      setFormData({ name: "", lastName: "", email: "", password: "" })
      setTouched({})
      setErrors({})
      navigate("/")

    } catch (err) {
      console.error("Något gick fel vid registrering:", err)
    }
  }

  const serverErrorText = errorMessage(error)

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-[calc(100dvh-var(--nav-height))] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-center bg-no-repeat bg-cover flex items-center px-2 py-6"
      style={{ backgroundImage: `url(${image})` }}
    >
      <section
        className="flex flex-col gap-4 md:gap-16 lg:gap-4 mx-auto max-w-2xl px-4 py-6 md:px-18 md:py-20 lg:px-20 lg:py-10 rounded-2xl shadow-2xl bg-white/90 backdrop-blur"
      >
        <div>
          <h1 className="text-xl font-bold">Registrera dig</h1>
        </div>

        {serverErrorText ? (
          <ErrorMessage className="mb-2">{serverErrorText}</ErrorMessage>
        ) : null}

        {/* Ändra de som behöver vara rerquired senare */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4">

          <fieldset className="flex p-2 flex-col gap-4 pb-6">
            <legend className="font-semibold text-lg pb-2">Dina uppgifter</legend>


            <div>
              <Input
                id='signup-name'
                type='text'
                label='Förnamn'
                onChange={onChange("name")}
                onBlur={onBlur("name")}
                value={formData.name}
                showLabel={true}
                required={true}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "error-name" : undefined}
              />
              <FieldError id="error-name" show={touched.name && !!errors.name}>
                {errors.name}
              </FieldError>
            </div>


            <div>
              <Input
                id="signup-lastname"
                type="text"
                label="Efternamn"
                onChange={onChange("lastName")}
                onBlur={onBlur("lastName")}
                value={formData.lastName}
                showLabel={true}
                required={true}
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={errors.lastName ? "error-lastName" : undefined}
              />
              <FieldError id="error-lastName" show={touched.lastName && !!errors.lastName}>
                {errors.lastName}
              </FieldError>
            </div>


            <div>
              <Input
                id="signup-email"
                type="email"
                label="Email"
                onChange={onChange("email")}
                onBlur={onBlur("email")}
                value={formData.email}
                showLabel={true}
                required={true}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "error-email" : undefined}
              />
              <FieldError id="error-email" show={touched.email && !!errors.email}>
                {errors.email}
              </FieldError>
            </div>


            <div>
              <Input
                id="signup-password"
                type="password"
                label="Lösenord"
                onChange={onChange("password")}
                onBlur={onBlur("password")}
                value={formData.password}
                showLabel={true}
                required={true}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "error-password" : undefined}
              />
              <FieldError id="error-password" show={touched.password && !!errors.password}>
                {errors.password}
              </FieldError>
            </div>
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