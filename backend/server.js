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


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})
