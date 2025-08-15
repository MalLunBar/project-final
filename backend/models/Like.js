import mongoose from "mongoose"

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  loppis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loppis",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Ensure that a user can only like a loppis once
likeSchema.index({ user: 1, loppis: 1 }, { unique: true })

export const Like = mongoose.model("Like", likeSchema)