import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import "./config/cloudinary.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Portfolio API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
