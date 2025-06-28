import mongoose from "mongoose";
const { Schema } = mongoose;

// Enums
const genderPreferences = ['male', 'female', 'any'];
const bookingStatuses = ['pending', 'confirmed', 'cancelled'];


const bookingSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hostel: { type: Number,required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    roomType: { type: String },
    status: { type: String, enum: bookingStatuses, default: 'pending' }
  }, { timestamps: true });


  const Booking =mongoose.model('Booking',bookingSchema);

  export default Booking;