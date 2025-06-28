import mongoose from "mongoose";
const { Schema } = mongoose;

// Enums
const genderPreferences = ['male', 'female', 'any'];
const bookingStatuses = ['pending', 'confirmed', 'cancelled'];



const citySchema = new Schema({
    name: { type: String, required: true, unique: true }
  });


  const City =mongoose.model('City',citySchema);

  export default City;