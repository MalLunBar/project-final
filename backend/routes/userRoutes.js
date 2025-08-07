import express from "express";
import bcrypt from "bcrypt-nodejs";
import { User } from "../models/User.js"

const router = express.Router()

// register a new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, email, password } = req.body
    // validate input
    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      })
    }
    // validate if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      })
    }
    // create a new user
    const salt = bcrypt.genSaltSync()
    const user = new User({ firstName, email: email.toLowerCase(), password: bcrypt.hashSync(password, salt) })
    await user.save()

    res.status(200).json({
      success: true,
      message: "User created successfully!",
      response: {
        id: user._id,
        accessToken: user.accessToken
      }
    })

  } catch (error) {
    res.status(400).json({
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

export default router