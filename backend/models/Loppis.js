import mongoose from 'mongoose'

const loppisSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  address: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  categoires: {
    type: [String],
    required: true,
    lowercase: true,
    enum: [
      "Vintage",
      "Barn",
      "Trädgård",
      "Kläder",
      "Möbler",
      "Böcker",
      "Husdjur",
      "Elektronik",
      "Kök",
      "Blandat"
    ],
    default: "Blandat"
  },
  description: {
    type: String,
    maxLength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

})

export const Loppis = mongoose.model('Loppis', loppisSchema)