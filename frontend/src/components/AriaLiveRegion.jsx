import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const AriaLiveRegion = () => {
  const { pathname } = useLocation()
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Customize messages per route
    switch (pathname) {
      case '/':
        setMessage("Startsida laddad")
        break
      case "/search":
        setMessage("Söksida laddad")
        break
      case "/loppis/:loppisId":
        setMessage("Loppissida laddad")
        break
      case "/profile":
        setMessage("Profilsida laddad")
        break
      default:
        setMessage("Sidan har laddats")
    }

    // Clear message after screen reader reads it
    const timeout = setTimeout(() => setMessage(""), 1000)
    return () => clearTimeout(timeout)
  }, [pathname])

  return (
    <div
      aria-live="polite"
      role="status"
      className="sr-only" // visually hidden but accessible to screen readers
    >
      {message}
    </div>
  )
}

export default AriaLiveRegion