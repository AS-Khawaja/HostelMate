import mongoose from "mongoose";
const { Schema } = mongoose;

// Enums
const genderPreferences = ['male', 'female', 'any'];
const bookingStatuses = ['pending', 'confirmed', 'cancelled'];

// =================== Host Schema (Separate Entity) ===================
const hostSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    organization: { type: String },
    bio: { type: String }
  }, { timestamps: true });

  const Host =mongoose.model('Host',hostSchema);

  export default Host;