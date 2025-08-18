import { cldUrl } from './cloudinaryUrl'

// Centrala presets så alla komponenter använder samma storlekar
export const IMG = {
  hero:  (id) => cldUrl(id, { w: 1200, crop: 'limit' }), // stor, ingen beskärning
  heroSm: (id) => cldUrl(id, { w: 800,  crop: 'limit' }),
  heroLg: (id) => cldUrl(id, { w: 1600, crop: 'limit' }),

  // Galleri-tumnaglar: små, beskär till samma aspekt
  thumb:  (id) => cldUrl(id, { w: 240, h: 180, crop: 'fill', gravity: 'auto' }),
  thumb2x: (id) => cldUrl(id, { w: 480, h: 360, crop: 'fill', gravity: 'auto' }),

  // Kort (listor)
  card:   (id) => cldUrl(id, { w: 320, h: 240, crop: 'fill', gravity: 'auto' }),
  card2x: (id) => cldUrl(id, { w: 640, h: 480, crop: 'fill', gravity: 'auto' }),
}
