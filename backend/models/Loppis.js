import mongoose from 'mongoose'

const loppisSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  location: {
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: {
        type: String,
        default: 'Sweden'
      }
    },
    coordinates: {
      // geoJSON Point format
      // https://docs.mongodb.com/manual/reference/geojson/#point
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      },
    },
  },
  dates: [
    {
      date: {
        type: Date,
        required: true
      },
      startTime: {
        type: String, // HH:MM format
        required: true
      },
      endTime: {
        type: String, // HH:MM format
        required: true
      }
    }
  ],
  categories: {
    type: [String],
    required: true,
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
  imageUrl: {
    type: String,
    default: 'loppis-placeholder-image.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

export const Loppis = mongoose.model('Loppis', loppisSchema)