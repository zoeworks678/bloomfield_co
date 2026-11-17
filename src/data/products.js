import sunsetPoppyImg from '../assets/products/sunset-poppy.jpg'
import blueDahliaImg from '../assets/products/blue-dahlia.jpg'
import classicRoseTrioImg from '../assets/products/classic-rose-trio.jpg'
import pastelTulipPosyImg from '../assets/products/pastel-tulip-posy.jpg'
import wildflowerMixImg from '../assets/products/wildflower-mix.jpg'
import daisyDelightImg from '../assets/products/daisy-delight.jpg'

// Placeholder catalog. Most products reuse the same illustrated flower/wrap
// art as the bouquet builder (via StaticBouquetPreview) rather than separate
// product photography, since real catalog photos haven't been provided yet.
// A product with a real photo (`image`) uses that instead — see
// ProductCard.jsx.
export const PRODUCTS = [
  {
    id: 'sunset-poppy',
    name: 'Sunset Poppy Bunch',
    price: 24,
    description: 'A hand-tied mix of orange, pink and peach poppies.',
    bestSeller: true,
    image: sunsetPoppyImg,
  },
  {
    id: 'blue-dahlia-dream',
    name: 'Blue Dahlia Dream',
    price: 28,
    description: 'Blue dahlias and hydrangea with white daisies and wildflowers.',
    bestSeller: true,
    image: blueDahliaImg,
  },
  {
    id: 'classic-rose-trio',
    name: 'Classic Rose Trio',
    price: 32,
    description: 'Three bold red roses, wrapped in black and cream.',
    bestSeller: true,
    image: classicRoseTrioImg,
  },
  {
    id: 'pastel-tulip-posy',
    name: 'Pastel Tulip Posy',
    price: 20,
    description: 'Peach tulips with sprigs of chamomile daisy.',
    image: pastelTulipPosyImg,
  },
  {
    id: 'wildflower-mix',
    name: 'Wildflower Mix',
    price: 65,
    description: 'Blue hydrangea with pastel dahlias, roses and freesia.',
    bestSeller: true,
    image: wildflowerMixImg,
  },
  {
    id: 'daisy-delight',
    name: 'Daisy Delight',
    price: 18,
    description: 'A generous bunch of chamomile daisies, simple and bright.',
    image: daisyDelightImg,
  },
]

export const BEST_SELLERS = PRODUCTS.filter((p) => p.bestSeller)
