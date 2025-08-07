import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button"

const SignUp = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      })
      {/* Ändra till ett global error message state senare */ }
      if (response.status === 409) {
        console.log("Ett konto med den här e-postadressen finns redan.")
        return
      }

      if (!response.ok) {
        throw new Error("Något gick fel vid registrering.")
      }

      const data = await response.json()



      // Rensa formuläret
      setFormData({
        name: "",
        lastName: "",
        email: "",
        password: "",
      })

    } catch (error) {
      console.error("Något gick fel vid registrering:", error)
    }
  }

  return (
    <article>
      <div>
        <h2 className="font-bold">Registrera dig</h2>
      </div>

      {/* Ändra de som behöver vara rerquired senare */}
      <form>
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
        <Button
          type="submit"
          onClick={handleSubmit}
          text="Registrera"
          ariaLabel="Registrera">
        </Button>
      </form>
    </article>
  )
}

export default SignUp