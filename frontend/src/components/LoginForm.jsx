import { useState } from "react"
import Input from "./Input"
import Button from "./Button"

const LoginForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formData.email, formData.password)
    setFormData({
      email: "",
      password: "",
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 my-6">
      <Input
        id='login-email'
        type='email'
        label='Email'
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        value={formData.email}
        showLabel={true}
        required={true}
      />

      <Input
        id='login-password'
        type='password'
        label='Lösenord'
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        value={formData.password}
        showLabel={true}
        required={true}
      />

      <Button
        text='Logga in'
        type='submit'
        ariaLabel='Logga in'
      />
    </form>
  )
}

export default LoginForm