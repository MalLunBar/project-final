import { MapPin, CirclePlus } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'

const Home = () => {
  return (
    <section>
      <h2>Välkommen!</h2>
      <h3>Hitta en loppis nära dig</h3>

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
