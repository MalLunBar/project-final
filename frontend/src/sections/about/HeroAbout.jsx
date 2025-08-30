import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'


const HeroAbout = ({ heroImage, title = 'Runt hörnet - loppis nära dig', lead = 'Vi gör det enkelt och roligt att hitta och dela loppisar i närheten. Vår vision är att fler prylar ska få ett nytt hem och att lokala möten ska uppstå - runt hörnet.' }) => {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 w-full">
            <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Grön monstera - en hint om hållbarhet och återbruk"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-zinc-400">Bild</div>
              )}
            </div>
          </div>


          <div className="flex-1">
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
            <p className="mt-4 text-zinc-700 max-w-prose">{lead}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/search"
                className="flex justify-center items-center gap-2 rounded-full shadow-md hover:shadow-lg font-medium transition py-2 px-4 cursor-pointer bg-button text-button-text hover:bg-button-hover hover:text-button-text-hover"
              >

                Upptäck loppisar
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export default HeroAbout