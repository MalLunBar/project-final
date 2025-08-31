import express from "express"
import bcrypt from "bcrypt-nodejs"
import mongoose from 'mongoose'
import { User } from "../models/User.js"
import { Loppis } from "../models/Loppis.js"
import { Like } from '../models/Like.js'
import { authenticateUser } from "../middleware/authMiddleware.js"

const router = express.Router()

// register a new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body
    // validate input
    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      })
    }


    const MIN_PASSWORD = 8
    if (String(password).length < MIN_PASSWORD) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD} characters long.`
      })
    }

    // validate if email already exists
    const normalizedEmail = String(email).toLowerCase().trim()
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      })
    }
    // create a new user
    const salt = bcrypt.genSaltSync()
    const user = new User({ firstName, lastName, email: email.toLowerCase(), password: bcrypt.hashSync(password, salt) })
    await user.save()

    res.status(200).json({
      success: true,
      message: "User created successfully!",
      response: {
        id: user._id,
        firstName: user.firstName,
        accessToken: user.accessToken
      }
    })

  } catch (error) {
    return res.status(400).json({
      success: false,
      response: error,
      message: "Failed to create user."
    })
  }
})

// login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    // validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }
    // validate if user exists
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // validate password
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        message: "Log in successful!",
        response: {
          id: user._id,
          firstName: user.firstName,
          accessToken: user.accessToken
        }
      })
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to log in",
      error,
    })
  }
})

// list loppis created by (authenticated) user
router.get("/:id/loppis", authenticateUser, async (req, res) => {
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

// list loppis liked by (authenticated) user
router.get("/:id/likes", authenticateUser, async (req, res) => {
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

export default router