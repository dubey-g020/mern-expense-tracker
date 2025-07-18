import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/auth/profile
// @desc    Get user profile (protected route)
// @access  Private
router.get("/profile", authMiddleware, (req, res) => {
  try {
    res.status(200).json({
      message: "Access granted",
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
