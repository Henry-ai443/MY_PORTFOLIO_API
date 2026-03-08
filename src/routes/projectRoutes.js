import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// GET routes (public — portfolio reads these)
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Mutations require admin auth
router.post("/", protect, upload.array("images", 10), createProject);
router.patch("/:id", protect, upload.array("images", 10), updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
