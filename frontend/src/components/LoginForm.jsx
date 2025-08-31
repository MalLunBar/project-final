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

  const [touched, setTouched] = useState({ email: false, password: false })

  const handleSubmit = (event) => {
    event.preventDefault()
    setTouched({ email: true, password: true })
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
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          aria-invalid={touched.email && !!fieldErrors.email}
          aria-describedby={touched.email && fieldErrors.email ? "login-email-error" : undefined}
        />
        <FieldError id="login-email-error" show={touched.email && !!fieldErrors.email}>{fieldErrors.email}</FieldError>
      </div>

      <div>
        <Input
          id="login-password"
          type="password"
          label="Lösenord"
          placeholder="*****"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}      
          value={formData.password}
          showLabel={true}
          required
          aria-invalid={touched.password && !!fieldErrors.password}          
          aria-describedby={touched.password && fieldErrors.password ? "login-password-error" : undefined}
        />
        <FieldError id="login-password-error" show={touched.password && !!fieldErrors.password}>
          {fieldErrors.password}
        </FieldError>
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