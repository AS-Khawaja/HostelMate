import express from "express";
import {
  register,
  login,
  getUser,
  updateUser,
  getAllBookings,
  createBooking,
  deleteBooking,
  addToWishlist,
  getWishlist,
  chat
} from "../controllers/hostels.controller.js";

const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", login);

// BOOKINGS
router.get("/bookings", getAllBookings);
router.post("/bookings", createBooking);
router.delete("/bookings/:booking_id", deleteBooking);

// WISHLIST
router.post("/wishlist", addToWishlist);
router.get("/wishlist/:student_id", getWishlist);

// CHAT
router.post("/chat", chat);

// USER (generic, keep at the bottom)
router.get("/user/:user_id", getUser);
router.put("/user/:user_id", updateUser);

export default router;
