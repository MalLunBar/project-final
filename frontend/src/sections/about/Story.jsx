import { Sparkles } from 'lucide-react'


const Story = () => {
  return (
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
            <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4" /> Vårt löfte</h3>
            <ul className="list-disc list-inside mt-3 text-zinc-700 space-y-2">
              <li>Snabbt att hitta – karta och sök i fokus.</li>
              <li>Schysst upplevelse – enkel design, noll brus.</li>
              <li>Lokalt först – stöttar initiativ där du bor.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}


export default Story