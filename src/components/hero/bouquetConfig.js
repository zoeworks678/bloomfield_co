import poppyImg from '../../assets/bouquet/poppy.png'
import dahliaImg from '../../assets/bouquet/dahlia.png'
import roseImg from '../../assets/bouquet/rose.png'
import tulipImg from '../../assets/bouquet/tulip.png'
import daisyImg from '../../assets/bouquet/daisy.png'
import wrappingImg from '../../assets/bouquet/wrapping.png'

// Every flower illustration is trimmed to its visible pixels and the stem
// base (where it should "plant" into the bouquet) sits at the very bottom
// of the image. stemBaseXFrac is how far across that bottom edge the stem
// actually sits (measured from the source art) — most are close to 0.5 but
// not exact, so placement stays visually centered on the stem, not the box.
// price is per stem, in whole dollars — placeholder pricing until real
// catalog pricing is provided.
export const FLOWER_TYPES = [
  { id: 'poppy', name: 'Poppy', image: poppyImg, aspect: 0.6411, stemBaseXFrac: 0.4723, price: 4 },
  { id: 'dahlia', name: 'Dahlia', image: dahliaImg, aspect: 0.6456, stemBaseXFrac: 0.4742, price: 6 },
  { id: 'rose', name: 'Rose', image: roseImg, aspect: 0.4878, stemBaseXFrac: 0.4658, price: 5 },
  { id: 'tulip', name: 'Tulip', image: tulipImg, aspect: 0.6411, stemBaseXFrac: 0.4792, price: 3 },
  { id: 'daisy', name: 'Daisy', image: daisyImg, aspect: 0.6456, stemBaseXFrac: 0.4733, price: 3 },
]

// Flat fee for the kraft wrap + twine tie, added once per custom bouquet.
export const WRAPPING_FEE = 5

// The wrapping illustration, trimmed the same way. aspect = width / height
// and drives the bouquet stage's CSS aspect-ratio so every percentage below
// lines up with the artwork regardless of screen size.
export const WRAP = {
  image: wrappingImg,
  aspect: 900 / 1203,
}

// The front flap + bow + skirt of the wrapping, traced by hand from the
// source art as fractions of the wrapping image (see
// scripts/ — reproduced in the PR description). This is rendered as a
// second copy of the wrapping image, clipped to this polygon, stacked
// ABOVE the flower stems — so the paper reads as wrapped *around* the
// bouquet instead of flowers pasted on top of it.
// To adjust: open the wrapping PNG in any image viewer, read pixel
// coordinates, divide x by the image width and y by the image height, and
// edit the pairs below (each is [xFraction, yFraction]).
export const WRAP_FRONT_CLIP_PATH = [
  [0.4556, 0.4905],
  [0.3333, 0.5403],
  [0.2333, 0.6484],
  [0.2333, 1],
  [0.7222, 1],
  [0.7222, 0.6484],
  [0.5778, 0.5403],
]

export const WRAP_FRONT_CLIP_CSS = `polygon(${WRAP_FRONT_CLIP_PATH.map(
  ([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`
).join(', ')})`

// Hand-placed slots for where stems "plant" into the wrap, as fractions of
// the bouquet stage (which shares the wrapping image's aspect ratio). Each
// slot also controls how tall the flower renders (as a fraction of the
// stage height) and its base rotation, so the arrangement reads as a fanned
// bouquet rather than flowers stacked in a row. New flowers claim the
// nearest free slot; once all are taken, slots are reused with extra random
// jitter (see useBouquet.js) so duplicates don't sit exactly on top of
// each other.
export const PLACEMENT_SLOTS = [
  { x: 0.47, y: 0.51, height: 0.46, rotate: -6 },
  { x: 0.4, y: 0.495, height: 0.52, rotate: -14 },
  { x: 0.55, y: 0.5, height: 0.5, rotate: 12 },
  { x: 0.34, y: 0.485, height: 0.43, rotate: -20 },
  { x: 0.61, y: 0.49, height: 0.44, rotate: 18 },
  { x: 0.46, y: 0.485, height: 0.56, rotate: 2 },
  { x: 0.52, y: 0.53, height: 0.39, rotate: 9 },
  { x: 0.4, y: 0.53, height: 0.37, rotate: -9 },
]
