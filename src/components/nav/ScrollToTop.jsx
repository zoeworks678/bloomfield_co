import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Resets scroll position on route changes, except when a navigation asks to
// scroll to a specific in-page section (see NavBar's Contact Us link).
function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    if (location.state?.scrollTo) return
    window.scrollTo(0, 0)
  }, [location.pathname, location.state])

  return null
}

export default ScrollToTop
