import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"

import loppisRoutes from "./routes/loppisRoutes.js"
import userRoutes from './routes/userRoutes.js'

// import { Loppis } from "./models/Loppis.js"
// import data from "./data.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"
mongoose.connect(mongoUrl)

const port = process.env.PORT || 8080
const app = express()

// seeding data to database
// if (process.env.RESET_DATABASE) {
//   const seedDatabase = async () => {
//     await Loppis.deleteMany({})
//     data.forEach(loppis => {
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
// --- End geocoding route ---


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})
