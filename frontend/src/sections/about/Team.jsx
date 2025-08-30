import { ArrowRight } from 'lucide-react'
import { TeamCard } from '../../components/TeamCard'


const Team = ({ team = [] }) => {
  return (
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
  )
}


export default Team