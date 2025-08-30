const Faq = ({ q, children }) => (
  <details className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
    <summary className="cursor-pointer list-none select-none font-medium">
      <span className="inline-block">{q}</span>
    </summary>
    <div className="mt-2 text-sm text-zinc-700">{children}</div>
  </details>
)


const FaqSection = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
      <h2 className="text-2xl font-bold">Vanliga frågor</h2>
      <div className="mt-4 space-y-3">
        <Faq q="Kostar det något att lägga upp en loppis?">Nej, det är gratis att lägga upp en annons just nu.</Faq>
        <Faq q="Måste jag skapa konto för att gilla eller spara?">Ja, med ett konto sparas dina favoriter på din profil.</Faq>
        <Faq q="Hur rapporterar jag fel eller lämnar feedback?">Hör av dig via sidan Kontakt så återkommer vi snabbt.</Faq>
      </div>
    </section>
  )
}


export default FaqSection