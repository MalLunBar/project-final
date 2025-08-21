import express from "express"

const router = express.Router()

// Geocoding route (Nominatim proxy)
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

// Reverse geocoding route (Nominatim proxy)
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