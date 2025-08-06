
import { useState } from "react"
import Input from "./Input"
import Button from "./Button"

const UserForm = ({ type, onSubmit }) => {

  const title = type === 'login' ? 'Logga in' : `${type === 'register' ? 'Registrera' : ''}`

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formData.email, formData.password)
    console.log('Login eller Registrera är klar!')
    console.log(formData)

    // Reset form data after submission
    setFormData({
      email: "",
      password: "",
    })
  }

  return (
    <article>
      <div>
        <h2>{title}</h2>
      </div>

      <form
        onSubmit={handleSubmit}>
        <Input
          id={`${type}-email`}
          type='email'
          label='Email'
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          value={formData.email}
          showLabel={true}
          required={true}
        />

        <Input
          id={`${type}-password`}
          type='password'
          label='Lösenord'
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          value={formData.password}
          showLabel={true}
          required={true}

        />

        <Button
          text={title}
          type='submit'
          ariaLabel={title}
        />
      </form>
    </article>
  )
}

export default UserForm