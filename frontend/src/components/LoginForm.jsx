import { useState } from "react"
import Input from "./Input"
import Button from "./Button"
import ErrorMessage from "./ErrorMessage"
import FieldError from "./FieldError"

const LoginForm = ({ onSubmit, isLoading, error, fieldErrors = {} }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formData.email, formData.password)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4">
      {error && <ErrorMessage id="login-error">{error}</ErrorMessage>}

      <div>
        <Input
          id='login-email'
          type='email'
          label='Email'
          placeholder='namn@email.se'
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          value={formData.email}
          showLabel={true}
          required={true}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
        />
        <FieldError id="login-email-error">{fieldErrors.email}</FieldError>
      </div>

      <div>
        <Input
          id='login-password'
          type='password'
          label='Lösenord'
          placeholder='*****'
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          value={formData.password}
          showLabel={true}
          required={true}
          aria-invalid={!!fieldErrors.password}
          aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
        />
        <FieldError id="login-password-error">{fieldErrors.password}</FieldError>
      </div>


      <Button
        text={isLoading ? "Loggar in..." : "Logga in"}
        type='submit'
        ariaLabel='Logga in'
      />
    </form>
  )
}

export default LoginForm