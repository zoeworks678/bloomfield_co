import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './checkout.css'

function Checkout() {
  const { lines, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [placed, setPlaced] = useState(false)

  if (placed) {
    return (
      <section className="checkout-page checkout-page--done">
        <h1>Thank you!</h1>
        <p>Your order is confirmed — this is a demo checkout, so no payment was actually taken.</p>
        <Link to="/" className="checkout-page__home-link">
          Back to Home
        </Link>
      </section>
    )
  }

  if (lines.length === 0) {
    return (
      <section className="checkout-page checkout-page--empty">
        <h1>Your cart is empty</h1>
        <p>Add a bouquet before checking out.</p>
        <Link to="/shop" className="checkout-page__home-link">
          Go to Shop
        </Link>
      </section>
    )
  }

  return (
    <section className="checkout-page">
      <h1>Checkout</h1>
      <p className="checkout-page__note">
        This is a demo checkout for a portfolio project — no real payment is processed.
      </p>

      <div className="checkout-page__grid">
        <ul className="checkout-page__lines">
          {lines.map((line) => (
            <li key={line.id}>
              <span>
                {line.qty} × {line.name}
              </span>
              <span>${(line.price * line.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <form
          className="checkout-page__form"
          onSubmit={(e) => {
            e.preventDefault()
            clearCart()
            setPlaced(true)
          }}
        >
          <div className="checkout-page__total">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <label>
            Full name
            <input type="text" required autoComplete="name" />
          </label>
          <label>
            Delivery address
            <input type="text" required autoComplete="street-address" />
          </label>
          <label>
            Card number
            <input type="text" inputMode="numeric" placeholder="4242 4242 4242 4242" required />
          </label>
          <button type="submit">Place order</button>
          <button type="button" className="checkout-page__back" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </form>
      </div>
    </section>
  )
}

export default Checkout
