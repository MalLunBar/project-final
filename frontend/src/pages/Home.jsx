import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CirclePlus } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'


const Home = () => {
  const { user } = useAuthStore()
  const { openLoginModal } = useModalStore()
  const navigate = useNavigate()

  const handleAdd = () => {
    if (!user) {
      openLoginModal('Du måste vara inloggad för att lägga till en loppis!')
      return
    }
    navigate("/add")
  }

  return (
    <section className='flex flex-col gap-4 py-6 px-4'>

      <h3>Hitta en loppis nära dig</h3>

      <Input
        label='Sök efter loppisar'
        type='text'
      />


      <Button text='Lägg till loppis' icon={CirclePlus} onClick={handleAdd} />

      <h3>Populära Loppisar</h3>



      {/* Loppis Array */}

    </section>
  )
}

export default Home
