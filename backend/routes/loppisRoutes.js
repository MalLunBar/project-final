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

  const query = {}

  try {
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
        data: loppises,
        totalCount: totalCount,
        currentPage: page,
        limit: limit,
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
    const startAt = DateTime.fromISO(`${req.body.date}T${req.body.startTime}`, { zone: 'Europe/Stockholm' }).toJSDate()
    const endAt = DateTime.fromISO(`${req.body.date}T${req.body.endTime}`, { zone: 'Europe/Stockholm' }).toJSDate()

    const newLoppis = await new Loppis({
      ...req.body,
      startTime: startAt,
      endTime: endAt
    }).save()

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