import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const JWT_SECRET = (typeof process.env.JWT_SECRET === "string" ? process.env.JWT_SECRET.trim() : process.env.JWT_SECRET) || "";
const JWT_EXPIRES = (typeof process.env.JWT_EXPIRES === "string" ? process.env.JWT_EXPIRES.trim() : process.env.JWT_EXPIRES) || "7d";

/**
 * POST /api/auth/signup
 * Create the first (and only) admin. Allowed only when no admin exists.
 */
export const signup = async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ error: "Server missing JWT_SECRET" });
    }

    const existing = await Admin.countDocuments();
    if (existing > 0) {
      return res.status(403).json({ error: "Admin already exists. Use login." });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const admin = await Admin.create({ email, password });
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({
      message: "Admin created. You can now log in.",
      token,
      email: admin.email,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "This email is already registered" });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * POST /api/auth/login
 * Login with email + password. Returns JWT.
 */
export const login = async (req, res) => {
  try {
    if (!JWT_SECRET || JWT_SECRET.length < 8) {
      return res.status(500).json({ error: "Server missing JWT_SECRET. Add JWT_SECRET=your-secret (min 8 chars) to api/.env and restart." });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await admin.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, email: admin.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/auth/me
 * Return current admin (requires valid token).
 */
export const me = async (req, res) => {
  try {
    res.json({ email: req.admin.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/auth/signup-allowed
 * Public. True only when no admin exists yet (first-time setup).
 */
export const signupAllowed = async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    res.json({ allowed: count === 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
