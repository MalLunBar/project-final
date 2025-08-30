import { MapPin, Sparkles, HeartHandshake } from 'lucide-react'


const Feature = ({ icon: Icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="rounded-lg border border-zinc-200 p-2"><Icon className="w-4 h-4" /></div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-zinc-700 max-w-prose">{children}</p>
    </div>
  </div>
)


const WhyUs = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
      <h2 className="text-2xl font-bold">Varför Runt hörnet?</h2>
      <div className="mt-4 flex flex-col gap-4">
        <Feature icon={MapPin} title="Karta först">Se vad som händer nära dig – datum, tider och beskrivningar på ett ställe.</Feature>
        <Feature icon={Sparkles} title="Smidigt att lägga upp">Skapa en loppis-annons med bilder och position på några minuter.</Feature>
        <Feature icon={HeartHandshake} title="Byggt för community">Följ kvarters-vibbarna, gilla favoriter och tipsa grannar.</Feature>
      </div>
    </section>
  )
}

export default WhyUs