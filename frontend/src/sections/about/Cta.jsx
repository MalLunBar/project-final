import { NavLink } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const Cta = () => {
  return (
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
            <NavLink
              to="/map"
              className="flex justify-center items-center gap-2 rounded-full shadow-md hover:shadow-lg font-medium transition py-2 px-4 cursor-pointer bg-white border-2 border-button text-button-text hover:bg-button-hover hover:text-button-text-hover"
            >
              Hitta loppisar nära dig <ArrowRight className="w-4 h-4" />
            </NavLink>
            <NavLink
              to="/add"
              className="flex justify-center items-center gap-2 rounded-full shadow-md hover:shadow-lg font-medium transition py-2 px-4 cursor-pointer bg-white border-2 border-button text-button-text hover:bg-button-hover hover:text-button-text-hover"
            >
              Skapa en annons
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cta
