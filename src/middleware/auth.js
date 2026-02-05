import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const JWT_SECRET = (typeof process.env.JWT_SECRET === "string" ? process.env.JWT_SECRET.trim() : process.env.JWT_SECRET) || "";

/**
 * Require valid JWT in Authorization: Bearer <token>.
 * Attaches req.admin (the admin document).
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Not authorized. Provide a valid token." });
    }
    if (!JWT_SECRET) {
      return res.status(500).json({ error: "Server auth not configured" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    next(error);
  }
};
