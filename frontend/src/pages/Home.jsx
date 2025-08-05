import { MapPin } from 'lucide-react'
import Button from '../components/Button'


const Home = () => {
  return (
    <section>
      <h2>Välkommen!</h2>
      <Button text='Hitta en loppis nära mig' icon={MapPin} />
      <Button text='button' />
    </section>
  )
}

export default Home
