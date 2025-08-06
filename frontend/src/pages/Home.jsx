import { MapPin, CirclePlus } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import UserForm from '../components/UserForm'

const Home = () => {

  //test av onSubmit. Kan tas bort senare
  const onSubmit = (email, password) => {
    console.log("Inskickade värden:");
    console.log("Email:", email);
    console.log("Password:", password);
  }

  return (
    <section>
      <h2>Välkommen!</h2>
      <h3>Hitta en loppis nära dig</h3>

      <UserForm 
        type='login'
        onSubmit={onSubmit}  />
   

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
