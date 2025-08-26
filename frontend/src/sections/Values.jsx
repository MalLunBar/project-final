import { Leaf, HeartHandshake, Recycle } from 'lucide-react'
import ValueCard from '../components/ValueCard'


const Values = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
      <h2 className="text-2xl font-bold">Våra värderingar</h2>
      <p className="mt-2 text-zinc-700 max-w-prose">Vi tror på cirkulär ekonomi, gemenskap och enkel teknik som gör nytta på riktigt.</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <ValueCard icon={Recycle} title="Cirkulärt">Prylar ska få ett längre liv. Återbruk är både smart och roligt.</ValueCard>
        <ValueCard icon={HeartHandshake} title="Gemenskap">Loppis handlar om människor. Vi gör det lätt att mötas lokalt.</ValueCard>
        <ValueCard icon={Leaf} title="Hållbart">Mindre nykonsumtion, mer omtanke om miljön – ett fynd i taget.</ValueCard>
      </div>
    </section>
  )
}


export default Values