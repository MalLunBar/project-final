import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { CirclePlus } from 'lucide-react'
import useAuthStore from "../stores/useAuthStore"
import MyFavorites from "../sections/MyFavorites"
import MyLoppis from "../sections/MyLoppis"

const Profile = () => {
  const { user, token } = useAuthStore()









  return (
    <main className="bg-[url(./monstera.jpg)] bg-center bg-no-repeat bg-cover bg-white/0 bg-blend-screen p-4">
      <h2 className="text-white font-bold">Hej {user.name}!</h2>

      <Link to='/add' className='inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50' >
        <CirclePlus className='w-4 h-4' />
        Lägg till loppis
      </Link>

      <MyLoppis />

      <MyFavorites />

    </main>
  )
}


export default Profile