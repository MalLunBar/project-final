import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"

import loppisRoutes from "./routes/loppisRoutes.js"
import userRoutes from './routes/userRoutes.js'

import { Loppis } from "./models/Loppis.js"
import loppisData from "./updated_loppis_data.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"
mongoose.connect(mongoUrl)

const port = process.env.PORT || 8080
const app = express()

// seeding data to database
// if (process.env.RESET_DATABASE) {
//   const seedDatabase = async () => {
//     await Loppis.deleteMany({})
//     loppisData.forEach(loppis => {
//       new Loppis(loppis).save()
//     })
//   }
//   seedDatabase()
// }

app.use(cors())
app.use(express.json())

// endpoint for documentation of the API
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app)
  res.json({
    message: "Welcome to the LoppisApp API",
    endpoints: endpoints
  })
})

// end point routes
app.use("/users", userRoutes)
app.use("/loppis", loppisRoutes)


// --- Geocoding route (Nominatim proxy) ---
app.get("/api/geocode", async (req, res) => {
  const q = req.query.q?.toString().trim()
  if (!q) return res.status(400).json({ error: "Missing q" })

  const limit = Number(req.query.limit ?? 200)
  const language = (req.query.language ?? "sv").toString()

  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("q", q)
  url.searchParams.set("format", "jsonv2") // kompakt standard
  url.searchParams.set("limit", limit)      // hämta lite fler, filtrera sen
  url.searchParams.set("countrycodes", "se")

  try {
    const r = await fetch(url.toString(), {
      headers: {
        "User-Agent": `LoppisApp/1.0 (${process.env.GEOCODER_CONTACT ?? "malinelundgren1991@gmail.com"})`,
        "Accept": "application/json",
        "Accept-Language": language,
      },
    })
    if (!r.ok) return res.status(r.status).json({ error: "Geocoding failed" })

    const data = await r.json()

    const allowed = new Set(["city", "town", "village", "hamlet", "locality"])
    const getClass = (d) => d.class ?? d.category // robust för olika format

    const filtered = (Array.isArray(data) ? data : [])
      .filter(d => getClass(d) === "place" && allowed.has(d.type))
      .sort((a, b) => (a.display_name || "").localeCompare(b.display_name || "", "sv"))
      .slice(0, limit)


    const result = filtered.map(d => ({
      name: d.display_name,
      lat: Number(d.lat),
      lon: Number(d.lon),
      type: d.type
    }))

    console.log("Efter filtrering:", result);
    res.json(result)

  } catch (e) {
    console.error("Geocode proxy error:", e)
    res.status(500).json({ error: "Upstream error" })
  }
})

// --- End geocoding route ---


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
