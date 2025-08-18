//Helper för att skapa en Url av bilden samt kunna sätta olika storlekar och till webp format

// src/utils/cloudinaryUrl.js (Vite)
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

export const cldUrl = (
  publicId,
  { w, h, crop, gravity = 'auto', quality = 'auto', format = 'auto', dpr } = {}
) => {
  if (!publicId) return ''
  const parts = []
  parts.push(`q_${quality}`, `f_${format}`)
  if (w) parts.push(`w_${w}`)
  if (h) parts.push(`h_${h}`)
  if (crop) parts.push(`c_${crop}`)
  if (gravity && crop) parts.push(`g_${gravity}`)
  if (dpr) parts.push(`dpr_${dpr}`)
  const transform = parts.join(',')
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`
}

