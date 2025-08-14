import express from "express"
import mongoose from "mongoose"
import { DateTime } from "luxon"
import { Loppis } from "../models/Loppis.js"

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
      query['location.address.city'] = city
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