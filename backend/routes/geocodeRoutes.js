import express from "express"

const router = express.Router()

// Swagger
/**
 * @openapi
 * tags:
 *   name: Geocoding
 *   description: Endpoints for converting between addresses and geographic coordinates using OpenStreetMap Nominatim.
 */

// Forward geocoding route
/**
 * @openapi
 * /api/geocode:
 *   get:
 *     tags:
 *       - Geocoding
 *     summary: Forward geocode an address or place
 *     description: Uses OpenStreetMap Nominatim to convert an address or place name into coordinates.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (address, place name, etc.)
 *     responses:
 *       200:
 *         description: Geocoding result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing query parameter
 *       500:
 *         description: Upstream error
 */
router.get("/", async (req, res) => {
  const q = req.query.q
  if (!q) return res.status(400).json({ error: "Missing q" })

  // Build Nominatim URL
  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("q", String(q))
  url.searchParams.set("format", "json")
  url.searchParams.set("limit", "1")
  url.searchParams.set("addressdetails", "1")
  url.searchParams.set("countrycodes", "se")

  try {
    const r = await fetch(url, {
      headers: {
        // Required by Nominatim policy: identify your app + contact
        "User-Agent": `LoppisApp/1.0 (${process.env.GEOCODER_CONTACT ?? "malinelundgren1991@gmail.com"})`,
        "Accept": "application/json",
      },
    })
    if (!r.ok) {
      return res.status(r.status).json({ error: "Geocoding failed" })
    }
    const data = await r.json()
    res.json(data)
  } catch (e) {
    console.error("Geocode proxy error:", e)
    res.status(500).json({ error: "Upstream error" })
  }
})

// Reverse geocoding route
/**
 * @openapi
 * /api/geocode/reverse:
 *   get:
 *     tags:
 *       - Geocoding
 *     summary: Reverse geocode coordinates
 *     description: Uses OpenStreetMap Nominatim to convert latitude/longitude into a human-readable address.
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude
 *     responses:
 *       200:
 *         description: Reverse geocoding result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Missing coordinates
 *       500:
 *         description: Upstream error
 */
router.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query
  if (!lat || !lon) return res.status(400).json({ error: "Missing coordinates" })

  // Nominatim URL
  const url = new URL("https://nominatim.openstreetmap.org/reverse")
  url.searchParams.set("lat", lat)
  url.searchParams.set("lon", lon)
  url.searchParams.set("format", "json")

  try {
    const r = await fetch(url, {
      headers: {
        // Required by Nominatim policy: identify your app + contact
        "User-Agent": `LoppisApp/1.0 (${process.env.GEOCODER_CONTACT ?? "malinelundgren1991@gmail.com"})`,
        "Accept": "application/json",
      },
    })
    if (!r.ok) {
      return res.status(r.status).json({ error: "Geocoding failed" })
    }
    const data = await r.json()
    res.json(data)
  } catch (e) {
    console.error("Geocode proxy error:", e)
    res.status(500).json({ error: "Upstream error" })
  }
})

export default router