import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const ScrollToTopAndFocus = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // scroll to top
    window.scrollTo(0, 0)

    // shift focus to <main>
    const main = document.getElementById("main-content")
    if (main) {
      main.focus()
    }
  }, [pathname])

  return null
}

export default ScrollToTopAndFocus 