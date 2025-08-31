import express from "express"
import bcrypt from "bcrypt-nodejs"
import mongoose from 'mongoose'
import { User } from "../models/User.js"
import { Loppis } from "../models/Loppis.js"
import { Like } from '../models/Like.js'
import { authenticateUser } from "../middleware/authMiddleware.js"

const router = express.Router()

// Swagger
/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management & authentication
 */

// register a new user
/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Alice
 *               lastName:
 *                 type: string
 *                 example: Andersson
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mySecret123
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     accessToken:
 *                       type: string
 *       409:
 *         description: User already exists
 */
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
/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Login user and return access token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mySecret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
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
/**
 * @openapi
 * /users/{id}/loppis:
 *   get:
 *     summary: Get all loppis ads created by a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of loppis ads created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Loppis'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/:id/loppis", authenticateUser, async (req, res) => {
  const userId = req.user._id.toString()

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Invalid userId"
      })
    }

    const loppises = await Loppis.find({ createdBy: userId })

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
/**
 * @openapi
 * /users/{id}/likes:
 *   get:
 *     summary: Get all loppis ads liked by a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of liked loppis ads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Loppis'
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No liked loppis found
 *       500:
 *         description: Server error
 */
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