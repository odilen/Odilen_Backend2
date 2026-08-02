import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    organizerEmail: { type: String, required: true, lowercase: true, trim: true },
    capacity: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
)

const Event = mongoose.model('Event', eventSchema)
export default Event
