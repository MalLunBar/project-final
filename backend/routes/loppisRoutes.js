import 'dotenv/config' // safety net om filen laddas separat i andra skript
import express from "express"
import mongoose from "mongoose"
import multer from 'multer'

import { v2 as cloudinary } from 'cloudinary'
import { Loppis } from "../models/Loppis.js"
import { Like } from '../models/Like.js'
import { authenticateUser } from "../middleware/authMiddleware.js"

const router = express.Router()

// Multer: lagra i minnet (inte disk)
const upload = multer({ storage: multer.memoryStorage() })

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})



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

// get popular loppis (most likes)
router.get("/popular", async (req, res) => {
  // returns the 10 most liked loppis
  const limit = 10

  try {
    const popularLoppis = await Loppis.find().sort("-likes").limit(limit)

    if (popularLoppis.length === 0) {
      return res.status(404).json({
        success: false,
        response: [],
        message: "No Loppis found on that query. Try another one."
      })
    }
    res.status(200).json({
      success: true,
      response: popularLoppis
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to fetch popular Loppis."
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
// === GEOKODNINGSHJÄLPARE (behåll precis som innan) ===
async function geocodeAddress({ street, postalCode, city }) {
  const q = `${street}, ${postalCode} ${city}, Sweden`
  const res = await fetch(`http://localhost:8080/api/geocode?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error(`Geocode failed: ${res.status}`)
  const arr = await res.json()
  if (!Array.isArray(arr) || arr.length === 0) return null
  const { lat, lon } = arr[0]
  return { lat: parseFloat(lat), lon: parseFloat(lon) }
}

// === PATCH: uppdatera loppis, inkl. bilder via multipart/form-data ===
router.patch('/:id', authenticateUser, upload.array('images', 6), async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, response: null, message: 'Invalid ID format.' })
  }

  try {
    const existing = await Loppis.findById(id)
    if (!existing) {
      return res.status(404).json({ success: false, response: null, message: 'Loppis not found!' })
    }

    // 1) Parsa "data" (kommer som string i multipart)
    let body = req.body || {}
    if (body && typeof body === 'object' && body.data) {
      body = typeof body.data === 'string' ? JSON.parse(body.data) : body.data
    }

    // 2) Ladda upp NYA filer (behåll ordningen)
    const uploadBufferToCloudinary = (buf) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'loppis', resource_type: 'image' },
          (err, result) => (err ? reject(err) : resolve(result.public_id))
        )
        stream.end(buf)
      })

    let uploadedNew = []
    if (req.files && req.files.length > 0) {
      uploadedNew = await Promise.all(req.files.map(f => uploadBufferToCloudinary(f.buffer)))
      // uploadedNew[0] motsvarar {type:'new', index:0} i order
    }

    // 3) Bygg slutlig bildlista från 'order' (NYTT kontrakt)
    //    Fallback: om 'order' saknas, kör "gammal" väg (images/keep + remove).
    let finalImages = null
    let coverImage = null
    const order = Array.isArray(body.order) ? body.order : null
    const coverIndex = Number.isInteger(body.coverIndex) ? body.coverIndex : 0

    if (order) {
      const prev = Array.isArray(existing.images) ? existing.images : []
      const uploadedMap = uploadedNew.reduce((acc, pid, idx) => (acc[idx] = pid, acc), {})
      const removedSetFromBody = new Set(Array.isArray(body.removedExistingPublicIds) ? body.removedExistingPublicIds : [])

      // Återskapa lista enligt 'order'
      const tmp = []
      for (const token of order) {
        if (token?.type === 'existing' && token.publicId && prev.includes(token.publicId)) {
          // hoppa över om den explicit markerats för borttag
          if (!removedSetFromBody.has(token.publicId)) tmp.push(token.publicId)
        } else if (token?.type === 'new' && Number.isInteger(token.index)) {
          const pid = uploadedMap[token.index]
          if (pid) tmp.push(pid)
        }
      }
      finalImages = tmp
      coverImage = finalImages[coverIndex] || null

      // Räkna ut vad som ska raderas i Cloudinary:
      // a) allt som användaren markerat i removedExistingPublicIds
      // b) PLUS allt som fanns i prev men inte längre finns i finalImages
      const finalSet = new Set(finalImages)
      const implicitRemoved = (prev || []).filter(pid => !finalSet.has(pid))
      const toDelete = new Set([
        ...removedSetFromBody,
        ...implicitRemoved,
      ])
      // säkerhet: radera inte om den faktiskt finns kvar i final
      const reallyDelete = [...toDelete].filter(pid => !finalSet.has(pid))

      if (reallyDelete.length) {
        await Promise.all(
          reallyDelete.map(pid =>
            cloudinary.uploader.destroy(pid).catch(() => null) // swallow failures
          )
        )
      }

    } else {
      // ---- Fallback till din tidigare logik (om en gammal klient skulle anropa) ----
      const imageMode = (body.imageMode || 'append').toLowerCase()
      const keepListRaw = Array.isArray(body.images) ? body.images : null
      const removeList = new Set(Array.isArray(body.removeImages) ? body.removeImages : [])

      let next = existing.images ? [...existing.images] : []
      if (imageMode === 'replace') {
        next = [...uploadedNew]
      } else {
        if (keepListRaw) {
          const keepSet = new Set(next)
          next = keepListRaw.filter(pid => keepSet.has(pid))
        }
        if (removeList.size > 0) {
          next = next.filter(pid => !removeList.has(pid))
        }
        if (uploadedNew.length > 0) {
          next = [...next, ...uploadedNew]
        }
      }

      finalImages = next
      if (body.coverImage && finalImages.includes(body.coverImage)) {
        coverImage = body.coverImage
      } else if (!existing.coverImage || !finalImages.includes(existing.coverImage)) {
        coverImage = finalImages[0] || null
      } else {
        coverImage = existing.coverImage
      }

      if (removeList.size > 0) {
        await Promise.all(
          [...removeList].map(pid =>
            cloudinary.uploader.destroy(pid).catch(() => null)
          )
        )
      }
    }

    // 4) Fält-uppdateringar (samma som innan)
    const addrIn = body.location?.address || {}
    const oldAddr = existing.location?.address || {}

    const streetChanged = addrIn.street?.trim() !== undefined && addrIn.street.trim() !== (oldAddr.street || '')
    const cityChanged = addrIn.city?.trim() !== undefined && addrIn.city.trim() !== (oldAddr.city || '')
    const postalCodeChanged = addrIn.postalCode?.trim() !== undefined && addrIn.postalCode.trim() !== (oldAddr.postalCode || '')
    const addressChanged = streetChanged || cityChanged || postalCodeChanged

    const $set = {}
    if (body.title !== undefined) $set.title = body.title
    if (body.description !== undefined) $set.description = body.description
    if (body.categories !== undefined) $set.categories = body.categories
    if (body.dates !== undefined) $set.dates = body.dates

    if (addrIn.street !== undefined) $set['location.address.street'] = addrIn.street
    if (addrIn.city !== undefined) $set['location.address.city'] = addrIn.city
    if (addrIn.postalCode !== undefined) $set['location.address.postalCode'] = addrIn.postalCode

    // Spara bilder (om vi byggt en ny lista)
    if (finalImages) {
      $set.images = finalImages
      $set.coverImage = coverImage
    }

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
          message: 'Kunde inte geokoda den nya adressen. Kontrollera stavning/postnummer.',
        })
      }
      $set['location.coordinates'] = {
        type: 'Point',
        coordinates: [geo.lon, geo.lat], // [lng, lat]
      }
    }

    if (Object.keys($set).length === 0) {
      return res.status(400).json({
        success: false,
        response: null,
        message: 'No changes provided. Skickade du några fält i "data" eller filer i "images[]"?',
      })
    }

    const updated = await Loppis.findByIdAndUpdate(id, { $set }, {
      new: true,
      runValidators: true,
      validateModifiedOnly: true,
    })

    return res.status(200).json({ success: true, response: updated, message: 'Loppis updated successfully!' })
  } catch (err) {
    console.error('Error in PATCH /loppis/:id:', err)
    return res.status(500).json({ success: false, response: null, message: 'Failed to update loppis ad.' })
  }
})


// Delete loppis ad
router.delete("/:id", authenticateUser, async (req, res) => {
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
      message: "Loppis deleted successfully!"
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
router.post('/', authenticateUser, upload.array('images', 6), async (req, res) => {
  const user = req.user

  try {

    if (!req.body?.data) {
      return res.status(400).json({ success: false, message: 'Missing "data" field in form-data' })
    }

    const payload = JSON.parse(req.body.data)

    const uploads = (req.files || []).map(file => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'loppis',        // spara original i en mapp
          resource_type: 'image',
        },
        (err, result) => {
          if (err) return reject(err)
          // Spara *public_id* så vi kan generera alla varianter vid delivery
          resolve(result.public_id)
        }
      )
      stream.end(file.buffer)
    }))

    const publicIds = await Promise.all(uploads)         // [ "loppis/abc123", ... ]
    payload.images = publicIds
    payload.coverImage = publicIds[0] || null

    // spara i DB med mongoose
    const doc = await Loppis.create(payload)
    return res.status(201).json({ success: true, response: doc })

  } catch (err) {
    console.error('POST /loppis error:', err)
    res.status(500).json({ success: false, message: err.message || 'Server error' })
  }
})






export default router