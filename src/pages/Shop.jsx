import ProductCard from '../components/product/ProductCard'
import { PRODUCTS } from '../data/products'
import './shop.css'

function Shop() {
  return (
    <section className="shop-page">
      <div className="shop-page__intro">
        <h1>Shop All</h1>
        <p>Ready-made bouquets, gathered and wrapped the same day you order.</p>
      </div>
      <div className="shop-page__grid">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default Shop
