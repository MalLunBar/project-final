
import { useState } from "react"
import Input from "./Input"
import Button from "./Button"

const UserForm = ({ type, onSubmit, onSwitchForm }) => {

  const titles = {
    login: 'Logga in',
    register: 'Registrera'
  }

  const title = titles[type] || 'Formulär'

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

  const isLogin = type === 'login'
  const switchText = isLogin
    ? 'Har du inget konto?'
    : 'Har du redan ett konto?'

  const switchButtonText = isLogin
    ? 'Registrera dig här'
    : 'Logga in här'

  return (
    <article>
      <div>
        <h2 className="font-bold">{title}</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 my-6 border">
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

        <div>
          <p>
            {switchText}{' '}
            <button
              type="button"
              onClick={onSwitchForm}
            >
              {switchButtonText}
            </button>
          </p>

        </div>
      </form>
    </article>
  )
}

export default UserForm