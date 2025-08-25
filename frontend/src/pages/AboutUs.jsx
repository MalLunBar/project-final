
import { ArrowRight, Leaf, HeartHandshake, MapPin, Recycle, Sparkles } from 'lucide-react'
import { TeamCard } from '../components/TeamCard'


const Divider = () => <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent my-12" />

export const Pill = ({ children }) => (
  <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-teal-50 text-teal-900 ring-1 ring-teal-200">
    {children}
  </span>
)

const ValueCard = ({ icon: Icon, title, children }) => (
  <div className="flex-1 min-w-[220px] max-w-[340px] rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="rounded-xl border border-zinc-200 p-2">
        <Icon className="w-5 h-5" aria-hidden />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-zinc-600">{children}</p>
  </div>
)

const AboutPage = () => {
  const team = [
    { name: 'Malin', role: 'Frontendutvecklare & Grundare', bio: 'Brinner för enkel UX och återbruk.', img: '' },
    { name: 'Mimmi', role: 'Utvecklare & Grundare', bio: 'Har en PhD i kemi och ett öga för detaljer.', img: '' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      {/* ...resten oförändrat… endast Hero-raden nedan visar Pill-exemplet */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <Pill>Om oss</Pill>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Runt hörnet – loppis nära dig
              </h1>
              {/* ... */}
            </div>
            {/* ... */}
          </div>
        </div>
      </section>

      {/* Team-sektionen */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold">Teamet</h2>
          <a href="/contact" className="text-sm inline-flex items-center gap-1 underline underline-offset-2">
            Kontakta oss <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          {team.map(m => <TeamCard key={m.name} {...m} />)}
        </div>
      </section>
    </main>
  )
}

export default AboutPage
