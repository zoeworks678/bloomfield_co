import { useCart } from '../../context/CartContext'
import StaticBouquetPreview from './StaticBouquetPreview'
import './product-card.css'

function ProductCard({ product }) {
  const { addProduct } = useCart()

  return (
    <article className="product-card">
      <div className="product-card__preview">
        {product.image ? (
          <img className="product-card__photo" src={product.image} alt="" />
        ) : (
          <StaticBouquetPreview arrangement={product.arrangement} />
        )}
      </div>
      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__description">{product.description}</p>
      <div className="product-card__footer">
        <span className="product-card__price">${product.price}</span>
        <button type="button" className="product-card__add" onClick={() => addProduct(product)}>
          Add to cart
        </button>
      </div>
    </article>
  )
}

export default ProductCard
