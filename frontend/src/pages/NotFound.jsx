import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"

const NotFound = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])


  const colorStyles = 'bg-white border-2 border-button text-button-text hover:bg-button-hover hover:text-button-text-hover rounded-4xl px-6 py-3 font-semibold shadow-md hover:shadow-xl'


  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-[calc(100dvh-var(--nav-height))] md:min-h-[calc(100dvh-var(--nav-height-md))] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-zinc-50"
    >
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 text-center">
        <div className="mx-auto inline-block rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600">
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
            className={colorStyles}
          >
            Till startsidan
          </NavLink>

          <NavLink
            to="/search"
            className={colorStyles}
          >
            Upptäck på kartan
          </NavLink>

          <NavLink
            to="/add"
            className={colorStyles}
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
