import { HashRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import NavBar from './components/nav/NavBar'
import ScrollToTop from './components/nav/ScrollToTop'
import CartDrawer from './components/cart/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Checkout from './pages/Checkout'

function App() {
  return (
    <HashRouter>
      <CartProvider>
        <ScrollToTop />
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <CartDrawer />
      </CartProvider>
    </HashRouter>
  )
}

export default App
