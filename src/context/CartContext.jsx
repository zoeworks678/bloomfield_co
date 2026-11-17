import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

let lineIdCounter = 0
function nextLineId() {
  lineIdCounter += 1
  return `cart-${lineIdCounter}`
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const addProduct = useCallback((product) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.kind === 'product' && line.productId === product.id)
      if (existing) {
        return prev.map((line) =>
          line.id === existing.id ? { ...line, qty: line.qty + 1 } : line
        )
      }
      return [
        ...prev,
        {
          id: nextLineId(),
          kind: 'product',
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        },
      ]
    })
    setIsOpen(true)
  }, [])

  const addCustomBouquet = useCallback((bouquet) => {
    setLines((prev) => [
      ...prev,
      {
        id: nextLineId(),
        kind: 'custom',
        name: 'Build-Your-Own Bouquet',
        price: bouquet.price,
        description: bouquet.description,
        qty: 1,
      },
    ])
    setIsOpen(true)
  }, [])

  const removeLine = useCallback((lineId) => {
    setLines((prev) => prev.filter((line) => line.id !== lineId))
  }, [])

  const setQty = useCallback((lineId, qty) => {
    setLines((prev) =>
      prev
        .map((line) => (line.id === lineId ? { ...line, qty: Math.max(1, qty) } : line))
        .filter(Boolean)
    )
  }, [])

  const clearCart = useCallback(() => setLines([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const itemCount = useMemo(() => lines.reduce((sum, line) => sum + line.qty, 0), [lines])
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.qty, 0),
    [lines]
  )

  const value = useMemo(
    () => ({
      lines,
      isOpen,
      itemCount,
      subtotal,
      addProduct,
      addCustomBouquet,
      removeLine,
      setQty,
      clearCart,
      openCart,
      closeCart,
    }),
    [lines, isOpen, itemCount, subtotal, addProduct, addCustomBouquet, removeLine, setQty, clearCart, openCart, closeCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
