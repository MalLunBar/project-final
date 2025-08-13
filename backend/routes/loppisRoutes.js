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

// get all thoughts by a specific user
// get all loppis ads by a specific user
router.get("/user", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      response: null,
      message: "User ID is required."
    });
  }

  try {
    // (Valfritt) strikt validering av id:
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, response: null, message: "Invalid userId" })
    }

    // Mongoose castar normalt sträng -> ObjectId utifrån ditt schema
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

//Like a loppis ad 
//add authentication later
router.post("/:id/like", async (req, res) => {
  const { id } = req.params

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

    // Toggle like status
    loppis.isLiked = !loppis.isLiked
    await loppis.save()

    res.status(200).json({
      success: true,
      response: loppis,
      message: `Loppis ad ${loppis.isLiked ? 'liked' : 'unliked'} successfully!`
    })
  } catch (error) {
    console.error("Error in POST /loppis/:id/like:", error)
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to like/unlike loppis ad."
    })
  }
})



//Edit loppis ad
//add authentication later
router.patch("/:id/edit", async (req, res) => {
  const { id } = req.params
  const updateFields = req.body

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Invalid ID format."
      })
    }

    const updatedLoppis = await Loppis.findByIdAndUpdate(id, updateFields, { new: true })

    if (!updatedLoppis) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Loppis not found!"
      })
    }

    res.status(200).json({
      success: true,
      response: updatedLoppis,
      message: "Loppis ad updated successfully!"
    })
  } catch (error) {
    console.error("Error in PATCH /loppis/:id:", error)
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to update loppis ad."
    })
  }
})

// Delete loppis ad
//add authentication later
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Invalid ID format."
      })
    }

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