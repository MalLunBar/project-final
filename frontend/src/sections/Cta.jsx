import { ArrowRight } from 'lucide-react'

const Cta = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Redo att hitta din nästa favoritpryl?</h2>
          <p className="mt-3 text-zinc-700 max-w-prose">Upptäck loppisar i närheten eller skapa din egen – det tar bara någon minut.</p>
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
  )
}


export default Cta