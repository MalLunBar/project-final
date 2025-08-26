import { ArrowRight, Leaf, HeartHandshake, MapPin, Recycle, Sparkles } from 'lucide-react'
import { TeamCard } from '../components/TeamCard'
import HeroImage from '../assets/monstera-1.jpg'
import ValueCard from '../components/ValueCard'

const Divider = () => <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent my-12" />


const AboutPage = () => {
  const team = [
    { name: 'Malin', role: 'Frontendutvecklare & Grundare', bio: 'Brinner för enkel UX och återbruk.', img: '' },
    { name: 'Mimmi', role: 'Utvecklare & Grundare', bio: 'Har en PhD i kemi och ett öga för detaljer.', img: '' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="flex flex-col md:flex-row items-center gap-10">

            <div className="flex-1 w-full">
              <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
                <img
                  src={HeroImage}
                  alt="Grön monstera - en hint om hållbarhet och återbruk"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div className="flex-1">
             
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Runt hörnet - loppis nära dig
              </h1>
              <p className="mt-4 text-zinc-700 max-w-prose">
                Vi gör det enkelt och roligt att hitta och dela loppisar i närheten. Vår vision är att fler
                prylar ska få ett nytt hem och att lokala möten ska uppstå - runt hörnet.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="/map" className="inline-flex items-center gap-2 rounded-xl bg-teal-700 text-white px-4 py-2 hover:bg-teal-800 transition">
                  Upptäck loppisar <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/add" className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2 hover:bg-zinc-50 transition">
                  Lägg till din loppis
                </a>
              </div>
            </div>

            
          </div>
        </div>
      </section>

      <Divider />

      {/* STORY + LÖFTE */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-start gap-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Hur allt började</h2>
            <p className="mt-3 text-zinc-700">
              Idén föddes när vi tröttnade på att missa små kvartersloppisar och popups. Vi ville ha en
              enkel plats som samlar allt – utan krångel. En karta först, tydliga datum och smarta filter.
              Så byggde vi Runt hörnet.
            </p>
            <p className="mt-3 text-zinc-700">
              Sedan starten har vi haft samma mål: göra lokal second hand mer tillgänglig och uppmuntra
              till återbruk i vardagen.
            </p>
          </div>
          <div className="flex-1">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Vårt löfte
              </h3>
              <ul className="list-disc list-inside mt-3 text-zinc-700 space-y-2">
                <li>Snabbt att hitta – karta och sök i fokus.</li>
                <li>Schysst upplevelse – enkel design, noll brus.</li>
                <li>Lokalt först – stöttar initiativ där du bor.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* VÄRDERINGAR */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <h2 className="text-2xl font-bold">Våra värderingar</h2>
        <p className="mt-2 text-zinc-700 max-w-prose">
          Vi tror på cirkulär ekonomi, gemenskap och enkel teknik som gör nytta på riktigt.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <ValueCard icon={Recycle} title="Cirkulärt">
            Prylar ska få ett längre liv. Återbruk är både smart och roligt.
          </ValueCard>
          <ValueCard icon={HeartHandshake} title="Gemenskap">
            Loppis handlar om människor. Vi gör det lätt att mötas lokalt.
          </ValueCard>
          <ValueCard icon={Leaf} title="Hållbart">
            Mindre nykonsumtion, mer omtanke om miljön – ett fynd i taget.
          </ValueCard>
        </div>
      </section>

      <Divider />

      {/* VARFÖR UNIKA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <h2 className="text-2xl font-bold">Varför Runt hörnet?</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-lg border border-zinc-200 p-2"><MapPin className="w-4 h-4" /></div>
            <div>
              <h3 className="font-semibold">Karta först</h3>
              <p className="text-sm text-zinc-700 max-w-prose">Se vad som händer nära dig – datum, tider och beskrivningar på ett ställe.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-lg border border-zinc-200 p-2"><Sparkles className="w-4 h-4" /></div>
            <div>
              <h3 className="font-semibold">Smidigt att lägga upp</h3>
              <p className="text-sm text-zinc-700 max-w-prose">Skapa en loppis-annons med bilder och position på några minuter.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-lg border border-zinc-200 p-2"><HeartHandshake className="w-4 h-4" /></div>
            <div>
              <h3 className="font-semibold">Byggt för community</h3>
              <p className="text-sm text-zinc-700 max-w-prose">Följ kvarters-vibbarna, gilla favoriter och tipsa grannar.</p>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* SÅ FUNKAR DET */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <h2 className="text-2xl font-bold">Så funkar det</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <Step n="1">Sök på kartan efter loppisar nära dig.</Step>
          <Step n="2">Filtrera på datum, kategori och lägg till favoriter.</Step>
          <Step n="3">Skapa din egen annons och dela med kvarteret.</Step>
        </div>
      </section>

      <Divider />

      {/* TEAM */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6" aria-labelledby="teamet-heading">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 id="teamet-heading" className="text-2xl font-bold">Teamet</h2>
          <a href="/contact" className="text-sm inline-flex items-center gap-1 underline underline-offset-2">
            Kontakta oss <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 justify-start">
          {team.map(m => <TeamCard key={m.name} {...m} />)}
        </div>
      </section>

      <Divider />

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <h2 className="text-2xl font-bold">Vanliga frågor</h2>
        <div className="mt-4 space-y-3">
          <Faq q="Kostar det något att lägga upp en loppis?">
            Nej, det är gratis att lägga upp en annons just nu.
          </Faq>
          <Faq q="Måste jag skapa konto för att gilla eller spara?">
            Du kan gilla utan konto. Med konto sparas dina favoriter på din profil.
          </Faq>
          <Faq q="Hur rapporterar jag fel eller lämnar feedback?">
            Hör av dig via sidan Kontakt så återkommer vi snabbt.
          </Faq>
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Redo att hitta din nästa favoritpryl?</h2>
            <p className="mt-3 text-zinc-700 max-w-prose">
              Upptäck loppisar i närheten eller skapa din egen – det tar bara någon minut.
            </p>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-3">
              <a href="/map" className="inline-flex items-center gap-2 rounded-xl bg-teal-700 text-white px-4 py-2 hover:bg-teal-800 transition">
                Hitta loppisar nära dig <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/add" className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2 hover:bg-zinc-50 transition">
                Skapa en annons
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Runt hörnet</p>
      </footer>
    </main>
  )
}

/* Små, återanvändbara UI-delar */
const Step = ({ n, children }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-700 text-white text-xs font-bold">{n}</div>
    <p className="text-sm text-zinc-700">{children}</p>
  </div>
)

const Faq = ({ q, children }) => (
  <details className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
    <summary className="cursor-pointer list-none select-none font-medium">
      <span className="inline-block">{q}</span>
    </summary>
    <div className="mt-2 text-sm text-zinc-700">{children}</div>
  </details>
)

export default AboutPage
