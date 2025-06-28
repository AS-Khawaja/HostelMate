import mongoose from "mongoose";
const { Schema } = mongoose;

// Enums
const genderPreferences = ['male', 'female', 'any'];
const bookingStatuses = ['pending', 'confirmed', 'cancelled'];


const universitySchema = new Schema({
    name: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true }
  });

  const University =mongoose.model('University',universitySchema);

  export default University;