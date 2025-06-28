import mongoose from "mongoose";
const { Schema } = mongoose;

// Enums
const genderPreferences = ['male', 'female', 'any'];
const bookingStatuses = ['pending', 'confirmed', 'cancelled'];

// =================== User Schema (Student) ===================
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  university: { type: String },
  course: { type: String },
  bio: { type: String }
}, { timestamps: true });

// =================== Host Schema (Separate Entity) ===================


// =================== City Schema ===================


// =================== University Schema ===================


// =================== Hostel Schema ===================


// =================== Booking Schema ===================


// =================== Wishlist Schema ===================


// =================== Export Models ===================
/*module.exports = {
  User: mongoose.model('User', userSchema),
  Host: mongoose.model('Host', hostSchema),
  City: mongoose.model('City', citySchema),
  University: mongoose.model('University', universitySchema),
  Hostel: mongoose.model('Hostel', hostelSchema),
  Booking: mongoose.model('Booking', bookingSchema),
  Wishlist: mongoose.model('Wishlist', wishlistSchema)
};*/

const User =mongoose.model('User',userSchema);

export default User;
