import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './cart-drawer.css'

function CartDrawer() {
  const { lines, isOpen, subtotal, removeLine, setQty, closeCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e) {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeCart])

  return (
    <div className={`cart-drawer${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen}>
      <div className="cart-drawer__scrim" onClick={closeCart} />
      <aside className="cart-drawer__panel" aria-label="Shopping cart">
        <div className="cart-drawer__header">
          <h2>Your bouquet cart</h2>
          <button type="button" className="cart-drawer__close" onClick={closeCart} aria-label="Close cart">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="cart-drawer__empty">Your cart is empty — find something lovely in the shop.</p>
        ) : (
          <ul className="cart-drawer__lines">
            {lines.map((line) => (
              <li key={line.id} className="cart-line">
                <div className="cart-line__info">
                  <p className="cart-line__name">{line.name}</p>
                  {line.description && <p className="cart-line__desc">{line.description}</p>}
                  <p className="cart-line__price">${line.price} each</p>
                </div>
                <div className="cart-line__controls">
                  <label className="cart-line__qty">
                    <span className="sr-only">Quantity</span>
                    <select
                      value={line.qty}
                      onChange={(e) => setQty(line.id, Number(e.target.value))}
                    >
                      {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="button" className="cart-line__remove" onClick={() => removeLine(line.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-drawer__footer">
          <div className="cart-drawer__subtotal">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className="cart-drawer__checkout"
            disabled={lines.length === 0}
            onClick={() => {
              closeCart()
              navigate('/checkout')
            }}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  )
}

export default CartDrawer
