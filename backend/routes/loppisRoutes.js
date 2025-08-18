import express from "express"
import mongoose from "mongoose"
import { Loppis } from "../models/Loppis.js"
import { Like } from '../models/Like.js'
import { authenticateUser } from "../middleware/authMiddleware.js"
import { useActionState } from "react"

const router = express.Router()

// get all loppis ads
router.get("/", async (req, res) => {
  const page = req.query.page || 1
  const limit = req.query.limit || 20
  const sortBy = req.query.sort_by || "-createdAt" // sort on most recently added by default

  try {
    const { city, date, category } = req.query
    const query = {}
    if (city) {
      query['location.address.city'] = new RegExp(city, "i")
    }
    if (category) {
      query.categories = category
    }
    if (date) {
      const now = new Date()
      if (date === 'today') {
        query['dates.date'] = {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lt: new Date(now.setHours(23, 59, 59, 999))
        }
      } else if (date === 'tomorrow') {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        query['dates.date'] = {
          $gte: tomorrow.setHours(0, 0, 0, 0),
          $lt: tomorrow.setHours(23, 59, 59, 999)
        }
      } else if (date === 'weekend') {
        const saturday = new Date()
        saturday.setDate(saturday.getDate() + (6 - saturday.getDay()))
        saturday.setHours(0, 0, 0, 0)

        const sunday = new Date(saturday)
        sunday.setDate(saturday.getDate() + 1)
        sunday.setHours(23, 59, 59, 999)

        query['dates.date'] = {
          $gte: saturday,
          $lt: sunday
        }
      } else if (date === 'next_week') {
        const nextMonday = new Date()
        nextMonday.setDate(nextMonday.getDate() + (9 - nextMonday.getDay()))
        nextMonday.setHours(0, 0, 0, 0)

        const nextSunday = new Date(nextMonday)
        nextSunday.setDate(nextMonday.getDate() + 5)
        nextSunday.setHours(23, 59, 59, 999)

        query['dates.date'] = {
          $gte: nextMonday,
          $lt: nextSunday
        }
      }
    }

    const totalCount = await Loppis.find(query).countDocuments()
    const loppises = await Loppis.find(query).sort(sortBy).skip((page - 1) * limit).limit(limit)

    if (loppises.length === 0) {
      return res.status(404).json({
        success: false,
        response: [],
        message: "No ads found on that query. Try another one."
      })
    }
    res.status(200).json({
      success: true,
      response: {
        totalCount: totalCount,
        currentPage: page,
        limit: limit,
        data: loppises,
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Server error while fetching ads."
    })
  }
})

//get all the category from enums in Loppis model
router.get("/categories", async (req, res) => {

  try {
    const categories = Loppis.schema.path("categories").caster.enumValues


    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        response: [],
        message: "No categories found."
      })
    }

    res.status(200).json({
      success: true,
      response: categories,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Server error while fetching categories."
    })
  }
})

// get all loppis ads by a specific (authenticated) user
router.get("/user", authenticateUser, async (req, res) => {
  const userId = req.user._id.toString()

  try {
    // (Valfritt) strikt validering av id:
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Invalid userId"
      })
    }

    const loppises = await Loppis.find({ createdBy: userId })

    // ⬇️ Viktig ändring: returnera 200 även om listan är tom
    return res.status(200).json({
      success: true,
      response: loppises
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      response: error,
      message: "Failed to fetch loppis ads for user."
    })
  }
})

// get all loppis liked by a specific user
router.get("/user/liked", authenticateUser, async (req, res) => {
  const user = req.user
  const page = req.query.page || 1
  const limit = req.query.limit || 10

  try {
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Invalid user ID format."
      })
    }

    const userLikes = await Like.find({ user: user })
    if (!userLikes || userLikes.length === 0) {
      return res.status(404).json({
        success: false,
        response: [],
        message: "No likes found for this user."
      })
    }

    const likedLoppis = await Loppis.find({ _id: { $in: userLikes.map(like => like.loppis) } })
      .sort("-createdAt").skip((page - 1) * limit).limit(limit)

    if (likedLoppis.length === 0) {
      return res.status(404).json({
        success: false,
        response: [],
        message: "No liked loppis found for this user."
      })
    }

    res.status(200).json({
      success: true,
      response: {
        totalCount: likedLoppis.length,
        currentPage: page,
        limit: limit,
        data: likedLoppis,
      },
      message: "Successfully fetched liked loppis ads."
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to fetch liked loppis ads."
    })
  }
})

// get one loppis by id
router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        sucess: false,
        response: null,
        message: "Invalid ID format."
      })
    }

    const loppis = await Loppis.findById(id)
    if (!loppis) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Loppis not found!"
      })
    }
    res.status(200).json({
      success: true,
      response: loppis
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      response: error,
      message: "Failed to fetch loppis."
    })
  }
})

// Like a loppis - only autheticated users
router.patch("/:id/like", authenticateUser, async (req, res) => {
  const { id } = req.params
  let action = ''

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Invalid ID format."
      })
    }

    const loppis = await Loppis.findById(id)
    if (!loppis) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Loppis not found!"
      })
    }

    // check if user has already liked this loppis or not
    const existingLike = await Like.findOne({ user: req.user._id, loppis: id })
    if (!existingLike) {
      action = 'liked'
      // create a like entry
      await new Like({ user: req.user._id, loppis: id }).save()
      // increse loppis likes by one
      await Loppis.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true, runValidators: true })
    } else {
      action = 'unliked'
      // remove like entry
      await Like.findByIdAndDelete(existingLike.id)
      // decrese loppis likes by one
      await Loppis.findByIdAndUpdate(id, { $inc: { likes: -1 } }, { new: true, runValidators: true })
    }

    res.status(200).json({
      success: true,
      response: {
        data: loppis,
        action: action
      },
      message: `Loppis ${action} successfully!`
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to like or unlike loppis."
    })
  }
})

//Edit loppis ad
// liten hjälpare för geokodning via din egen backend-proxy
async function geocodeAddress({ street, postalCode, city }) {
  const q = `${street}, ${postalCode} ${city}, Sweden`
  const res = await fetch(`http://localhost:8080/api/geocode?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error(`Geocode failed: ${res.status}`)
  const arr = await res.json()
  if (!Array.isArray(arr) || arr.length === 0) return null
  const { lat, lon } = arr[0]
  return { lat: parseFloat(lat), lon: parseFloat(lon) }
}
//add authentication later
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, response: null, message: 'Invalid ID format.' })
  }

  try {
    const existing = await Loppis.findById(id)
    if (!existing) {
      return res.status(404).json({ success: false, response: null, message: 'Loppis not found!' })
    }

    // Plocka ut ev. inkommande fält
    const body = req.body || {}
    const addrIn = body.location?.address || {}

    // Jämför adress (trim för att undvika falska skillnader)
    const oldAddr = existing.location?.address || {}
    const streetChanged = addrIn.street?.trim() !== undefined && addrIn.street.trim() !== (oldAddr.street || '')
    const cityChanged = addrIn.city?.trim() !== undefined && addrIn.city.trim() !== (oldAddr.city || '')
    const postalCodeChanged = addrIn.postalCode?.trim() !== undefined && addrIn.postalCode.trim() !== (oldAddr.postalCode || '')
    const addressChanged = streetChanged || cityChanged || postalCodeChanged

    // Bygg $set med dot-paths för säkra updates (rör inte coordinates i onödan)
    const $set = {}
    if (body.title !== undefined) $set.title = body.title
    if (body.description !== undefined) $set.description = body.description
    if (body.categories !== undefined) $set.categories = body.categories
    if (body.dates !== undefined) $set.dates = body.dates

    if (addrIn.street !== undefined) $set['location.address.street'] = addrIn.street
    if (addrIn.city !== undefined) $set['location.address.city'] = addrIn.city
    if (addrIn.postalCode !== undefined) $set['location.address.postalCode'] = addrIn.postalCode

    // Om adressändring → geokoda och uppdatera coordinates
    if (addressChanged) {
      const geo = await geocodeAddress({
        street: $set['location.address.street'] ?? oldAddr.street,
        city: $set['location.address.city'] ?? oldAddr.city,
        postalCode: $set['location.address.postalCode'] ?? oldAddr.postalCode,
      })
      if (!geo) {
        return res.status(422).json({
          success: false,
          response: null,
          message: 'Kunde inte geokoda den nya adressen. Kontrollera stavning/postnummer.'
        })
      }
      $set['location.coordinates'] = {
        type: 'Point',
        coordinates: [geo.lon, geo.lat], // OBS: [lng, lat]
      }
    }

    const updated = await Loppis.findByIdAndUpdate(id, { $set }, {
      new: true,
      runValidators: true,
      validateModifiedOnly: true,
    })

    return res.status(200).json({
      success: true,
      response: updated,
      message: 'Loppis updated successfully!'
    })
  } catch (err) {
    console.error('Error in PATCH /loppis/:id:', err)
    return res.status(500).json({
      success: false,
      response: null,
      message: 'Failed to update loppis ad.'
    })
  }
})

// Delete loppis ad
//add authentication later
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      response: null,
      message: "Invalid ID format."
    })
  }

  try {
    const deletedLoppis = await Loppis.findByIdAndDelete(id)

    if (!deletedLoppis) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Loppis not found!"
      })
    }

    res.status(200).json({
      success: true,
      response: deletedLoppis,
      message: "Loppis ad deleted successfully!"
    })
  } catch (error) {
    console.error("Error in DELETE /loppis/:id:", error)
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to delete loppis ad."
    })
  }
})

// add a loppis ad
// ------------- TODO: Add authentication later -----------------------
router.post('/', async (req, res) => {

  try {
    const newLoppis = new Loppis(req.body);
    await newLoppis.save()

    res.status(201).json({
      success: true,
      response: newLoppis,
      message: "Ad successfully posted!"
    })

  } catch (error) {
    console.error("Error in POST /loppis:", error)

    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to post ad."
    })
  }
})






export default router