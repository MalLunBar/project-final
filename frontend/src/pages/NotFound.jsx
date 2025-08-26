import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"

const NotFound = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])



  return (
    <main className="h-screen max-h-[calc(100vh-64px) md:max-h-[calc(100vh-72px)] w-full grid place-items-center px-4 py-16 bg-zinc-50">
      <section className="max-w-2xl w-full text-center">
        <div className="inline-block rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600">
          404 - Sidan kunde inte hittas
        </div>

        <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Hoppsan! Den här sidan finns inte.
        </h1>
        <p className="mt-4 text-zinc-600">
          Adressen <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded">{pathname}</span>{" "}
          verkar vara felstavad eller inte längre tillgänglig.
        </p>


        <div className="mt-10 flex flex-col items-center gap-4">
          <NavLink
            to="/"
            className="inline-block rounded-full bg-white text-orange-500 font-semibold px-8 py-3 shadow hover:shadow-md hover:scale-[1.02] transition"
          >
            Till startsidan
          </NavLink>

          <NavLink
            to="/search"
            className="inline-block rounded-full bg-white text-orange-500 font-semibold px-8 py-3 shadow hover:shadow-md hover:scale-[1.02] transition"
          >
            Upptäck på kartan
          </NavLink>

          <NavLink
            to="/add"
            className="inline-block rounded-full bg-white text-orange-500 font-semibold px-8 py-3 shadow hover:shadow-md hover:scale-[1.02] transition"
          >
            Skapa Loppis
          </NavLink>
        </div>

        <div className="mt-12 text-sm text-zinc-500">
          <p>Behöver du hjälp? <a className="underline hover:text-zinc-700" href="/contact">Kontakta oss</a>.</p>
        </div>
      </section>
    </main>
  )
}

export default NotFound
