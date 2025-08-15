import { User } from "../models/User.js"

export const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.header("Authorization")
    const user = await User.findOne({ accessToken: accessToken })
    if (user) {
      req.user = user
      next()
    } else {
      res.status(401).json({
        message: "Authentication missing or invalid.",
        loggedOut: true
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}