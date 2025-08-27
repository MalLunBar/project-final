import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'
import Button from '../components/Button'

const CtaHome = () => {
  const { user } = useAuthStore()
  const { openLoginModal } = useModalStore()

  const handleAdd = () => {
    if (!user) {
      openLoginModal('Du måste vara inloggad för att lägga till en loppis!')
      return
    }
    navigate("/add")
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white shadow-sm p-10 text-center">
        <h2 className="text-2xl font-bold">Har du saker att sälja?</h2>
        <p className="mt-3 text-zinc-700">Lägg upp din egen loppis och nå ut till fler loppisälskare!</p>
        <Button text='Skapa annons' type='button' onClick={() => handleAdd()} active={true} classNames='mx-auto mt-6 py-3 px-5' />
      </div>
    </section>
  )
}

export default CtaHome