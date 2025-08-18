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
  images: [{
    publicId: { type: String, required: true },
    width: Number,
    height: Number,
    format: String,
  }],
  coverImage: String,

  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Pre-save hook to automatically geocode address
loppisSchema.pre('save', async function (next) {
  if (this.isModified('location.address')) {

    const { street, city, postalCode } = this.location.address
    const query = `${street}, ${postalCode} ${city}, Sweden`

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      const response = await fetch(url)
      const data = await response.json()

      if (data.length > 0) {
        const { lat, lon } = data[0]
        this.location.coordinates = {
          type: 'Point',
          coordinates: [parseFloat(lon), parseFloat(lat)]
        }
      } else {
        throw new Error('Address not found')
      }
    } catch (error) {
      return next(error)
    }
  }
  next()
})

export const Loppis = mongoose.model('Loppis', loppisSchema)