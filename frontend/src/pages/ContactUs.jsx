import { Mail } from "lucide-react"
import bgImage from '../assets/botanical-4.jpg'

const Contact = () => {
  return (
    <main
      className="flex flex-col items-center justify-center w-screen min-h-screen bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg mb-24">
        <h1 className="text-3xl font-bold mb-4">Kontakta oss</h1>
        <p className="text-zinc-700 mb-6">
          Har du frågor, idéer eller vill komma i kontakt med oss? Tveka inte att höra av dig!
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-black" />
            <a
              href="mailto:info@loppisappen.se"
              className="text-black hover:underline"
            >
              info@loppisappen.se
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-black" />
            <a
              href="mailto:support@loppisappen.se"
              className="text-black hover:underline"
            >
              support@loppisappen.se
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
