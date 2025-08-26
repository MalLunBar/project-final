const Step = ({ n, children }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-700 text-white text-xs font-bold">{n}</div>
    <p className="text-sm text-zinc-700">{children}</p>
  </div>
)


const HowItWorks = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
      <h2 className="text-2xl font-bold">Så funkar det</h2>
      <div className="mt-4 flex flex-wrap gap-4">
        <Step n="1">Sök på kartan efter loppisar nära dig.</Step>
        <Step n="2">Filtrera på datum, kategori och lägg till favoriter.</Step>
        <Step n="3">Skapa din egen annons och dela med kvarteret.</Step>
      </div>
    </section>
  )
}


export default HowItWorks