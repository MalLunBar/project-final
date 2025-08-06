import express from "express"
import mongoose from "mongoose"
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

// add a loppis ad
// ------------- TODO: Add authentication later -----------------------
router.post('/', async (req, res) => {
  const { title, startTime, endTime, address, latitude, longitude, categoires, description } = req.body

  try {

    // -------------- TODO: validate input ---------------------

    const newLoppis = await new Loppis({ title, startTime, endTime, address, latitude, longitude, categoires, description }).save()

    if (!newLoppis) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Failed to create ad."
      })
    }

    res.status(201).json({
      success: true,
      response: newLoppis,
      message: "Ad successfully posted!"
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to post ad."
    })
  }
})

export default router