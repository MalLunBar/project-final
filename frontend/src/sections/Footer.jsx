const Footer = ({ footerText }) => {
  return (
    <footer className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <p className="text-xs text-zinc-500">{footerText}</p>
    </footer>
  )
}

export default Footer