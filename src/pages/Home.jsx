import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BouquetHero from '../components/hero/BouquetHero'
import ProductCard from '../components/product/ProductCard'
import { BEST_SELLERS } from '../data/products'
import './home.css'

function Home() {
  const location = useLocation()
  const contactRef = useRef(null)
  const [messageSent, setMessageSent] = useState(false)

  useEffect(() => {
    if (location.state?.scrollTo === 'contact' && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.state])

  return (
    <>
      <BouquetHero />

      <section className="home-section home-section--bestsellers" aria-labelledby="bestsellers-heading">
        <h2 id="bestsellers-heading">Best Sellers</h2>
        <p className="home-section__lede">The arrangements our customers reach for again and again.</p>
        <div className="home-section__grid">
          {BEST_SELLERS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="home-section home-section--about" aria-labelledby="about-heading">
        <h2 id="about-heading">About Us</h2>
        <p>
          Bloomfield &amp; Co. started as a single market stall and a love for flowers that refuse to
          look arranged. Every bouquet we send out is gathered by hand, wrapped in recycled kraft
          paper, and tied the same way you'd tie one for a friend.
        </p>
        <p>
          We work with small growers wherever we can, and we keep our selection seasonal — what's in
          the shop is what's actually in bloom.
        </p>
      </section>

      <section id="contact" ref={contactRef} className="home-section home-section--contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contact Us</h2>
        <div className="home-contact__grid">
          <div className="home-contact__info">
            <p>
              <strong>Visit the shop</strong>
              <br />
              12 Market Lane, Riverside
            </p>
            <p>
              <strong>Hours</strong>
              <br />
              Tue–Sat, 9am–6pm
            </p>
            <p>
              <strong>Say hello</strong>
              <br />
              hello@bloomfieldandco.example
            </p>
          </div>
          {messageSent ? (
            <p className="home-contact__sent">
              Thanks for reaching out — we'll get back to you soon.
            </p>
          ) : (
            <form
              className="home-contact__form"
              onSubmit={(e) => {
                e.preventDefault()
                setMessageSent(true)
              }}
            >
              <label>
                Name
                <input type="text" name="name" autoComplete="name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" autoComplete="email" required />
              </label>
              <label>
                Message
                <textarea name="message" rows="4" required />
              </label>
              <button type="submit">Send message</button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

export default Home
