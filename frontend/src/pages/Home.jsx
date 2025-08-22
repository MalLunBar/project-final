import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CirclePlus } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'


const Home = () => {
  const { user, logout } = useAuthStore()
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
    <main className='flex flex-col items-center w-full gap-4'>

      {/* Hero section */}
      <section className='w-full bg-[url(./monstera.jpg)] bg-center bg-no-repeat bg-cover py-18 px-6 text-center'>
        <h1 className='text-white text-2xl font-semibold mb-6'>Hitta en loppis nära dig</h1>
        <form>
          <Input
            label='Sök stad eller område...'
            type='text'
          />
          {/* submit knapp */}
        </form>
        {/* My location - knapp */}

      </section>

      {/* Carousel section */}
      {/* popular / near / upcoming */}
      <h3>Populära Loppisar</h3>



      {/* Categories grid */}


      {/* CTA - Add your own loppis */}
      <Button text='Lägg till loppis' icon={CirclePlus} onClick={handleAdd} />





      {/* test av logga in funktion - TA BORT NÄR DET FINNS LOGGA UT KNAPP NÅGON ANNANSTANS */}
      {user ? (
        <>
          <h2>Välkommen, {user.firstName}!</h2>
          <Button
            text='Logga ut'
            onClick={logout}
          />
        </>
      ) : (
        <>
          <h2>Välkommen!</h2>
          <Button
            text='Logga in'
            onClick={() => openLoginModal()}
          />
        </>
      )}

    </main>
  )
}

export default Home
