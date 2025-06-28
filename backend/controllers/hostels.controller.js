import User from "../models/user.model.js";
import Hostel from "../models/hostel.model.js";
import Booking from "../models/booking.model.js";
import Wishlist from "../models/wishlist.model.js";
import { GoogleGenerativeAI } from '@google/generative-ai';


// Configure Gemini
const genAI = new GoogleGenerativeAI("AIzaSyAEk61MWHp0TXFp1lwDW-gTyg5BEESdNAA");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Register User
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already exists' });

    const user = new User({ name, email, password });
    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Login User
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get User by ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.user_id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ message: 'User profile updated', user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update user profile' });
  }
};

// Get All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('student').populate('hostel');
    const result = bookings.map(b => ({
      id: b._id,
      user_id: b.student._id,
      user_name: b.student.name,
      hostel_id: b.hostel,
      hostel_name: b.hostel.name,
      check_in: b.checkInDate.toISOString().split('T')[0],
      check_out: b.checkOutDate.toISOString().split('T')[0],
      room_type: b.roomType,
      total_price: b.totalPrice,
      status: 'Confirmed' // hardcoded as in original
    }));
    return res.json({ bookings: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Create Booking
export const createBooking = async (req, res) => {
  const { user_id, hostel_id, room_type, check_in, check_out, total_price } = req.body;

  try {
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return res.status(400).json({ error: 'Invalid check-in or check-out date' });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: 'Check-out must be after check-in' });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({ error: 'Check-in cannot be in the past' });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    

    const booking = new Booking({
      student: user_id,
      hostel: hostel_id, // or parseInt(hostel_id) if using numeric _id
      roomType: room_type,
      checkInDate,
      checkOutDate,
      totalPrice: total_price,
    });

    await booking.save();

    return res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        //hostel_name: hostel.name,
        check_in: check_in,
        check_out: check_out,
        room_type: room_type,
        total_price: total_price,
        status: booking.status,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete Booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.booking_id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    await booking.deleteOne();
    return res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Add to Wishlist / Remove
export const addToWishlist = async (req, res) => {
  const { student_id, hostel_id, remove } = req.body;
  try {
    const user = await User.findById(student_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existing = await Wishlist.findOne({ student: student_id, hostel: hostel_id });
    if (existing) {
      if (remove) {
        await existing.remove();
        return res.json({ message: 'Hostel removed from wishlist' });
      }
      return res.json({ message: 'Hostel already in wishlist' });
    }

    const newItem = new Wishlist({ student: student_id, hostel: hostel_id });
    await newItem.save();
    return res.status(201).json({
      message: 'Hostel added to wishlist',
      wishlist_item: {
        id: newItem._id,
        student_id,
        hostel_id,
        created_at: newItem.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const student_id = req.params.student_id;
    const user = await User.findById(student_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const items = await Wishlist.find({ student: student_id }).populate('hostel');
    const wishlist = items.map(item => ({
      id: item.hostel._id,
      name: item.hostel.name,
      description: item.hostel.description,
      address: item.hostel.address,
      price_per_month: item.hostel.price_per_month,
      gender_preference: item.hostel.gender_preference,
      available_rooms: item.hostel.available_rooms,
      total_rooms: item.hostel.total_rooms,
      wishlist_id: item._id,
      added_on: item.createdAt
    }));
    return res.json({ wishlist, count: wishlist.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// AI Chat with Gemini
export const chat = async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  try {
    const systemPrompt = `
      You are HostelMate AI, a helpful assistant for a student accommodation platform.
      You help students find suitable hostels and PGs near universities across Pakistan.
      Avoid giving personal opinions, do not fabricate listings, and stay helpful & friendly.
    `;

    let prompt = systemPrompt + "\n\n";
    for (let m of history) {
      prompt += `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}\n`;
    }
    prompt += `User: ${message}\nAssistant:`;

    const result = await model.generateContent(prompt);
    return res.json({ response: result.response.text() });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      response: 'Sorry, something went wrong with Gemini. Please try again.'
    });
  }
};
