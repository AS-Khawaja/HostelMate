import mongoose from "mongoose";
const { Schema } = mongoose;

// Enums
const genderPreferences = ['male', 'female', 'any'];
const bookingStatuses = ['pending', 'confirmed', 'cancelled'];


const hostelSchema = new Schema({
    hostel_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    university: { type: Schema.Types.ObjectId, ref: 'University' },
    host: { type: Schema.Types.ObjectId, ref: 'Host', required: true },
    totalRooms: { type: Number, required: true },
    availableRooms: { type: Number, required: true },
    pricePerMonth: { type: Number, required: true },
    genderPreference: { type: String, enum: genderPreferences, default: 'any' },
    createdAt: { type: Date, default: Date.now }
  });


  const Hostel =mongoose.model('Hostel',hostelSchema);

  export default Hostel;