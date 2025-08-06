import { useState } from 'react'
import { MapPin, CirclePlus } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import UserForm from '../components/UserForm'


const Home = () => {
  //Test för login knapp 
  const [showPopup, setShowPopup] = useState(false)
  const [formType, setFormType] = useState('login')

  const handleOpenLogin = () => {
    console.log('Logga in knapp klickad!')
    setFormType('login')
    setShowPopup(true)

  }

  //test av onSubmit. Kan tas bort senare
  const onSubmit = (email, password) => {
    console.log("Inskickade värden:")
    console.log("Email:", email)
    console.log("Password:", password)
    setShowPopup(false)
  }



  return (
    <section>

      <Button
        text='Logga in'
        onClick={handleOpenLogin}
      />


      <h2>Välkommen!</h2>
      <h3>Hitta en loppis nära dig</h3>



      {showPopup && (
        <UserForm
          type={formType}
          onSubmit={onSubmit}
          onSwitchForm={() =>
            setFormType((prev) => (prev === 'login' ? 'register' : 'login'))
          }
        />
      )}


      <Input
        label='Sök efter loppisar'
        type='text'
      />


      <Button text='Lägg till loppis' icon={CirclePlus} />

      <h3>Populära Loppisar</h3>

      

      {/* Loppis Array */}

    </section>
  )
}

export default Home
