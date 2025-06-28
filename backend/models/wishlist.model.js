import mongoose from "mongoose";
const { Schema } = mongoose;

// Enums
const genderPreferences = ['male', 'female', 'any'];
const bookingStatuses = ['pending', 'confirmed', 'cancelled'];


const wishlistSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hostel: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true }
  }, { timestamps: true });


  const Wishlist =mongoose.model('Wishlist',wishlistSchema);

  export default Wishlist;