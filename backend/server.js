import 'dotenv/config'               // <-- MÅSTE stå allra först
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import loppisRoutes from "./routes/loppisRoutes.js"
import userRoutes from './routes/userRoutes.js'
import geocodeRoutes from './routes/geocodeRoutes.js'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"
mongoose.connect(mongoUrl)

const port = process.env.PORT || 8080
const app = express()

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
app.use("/api/geocode", geocodeRoutes)


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})
