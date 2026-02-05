import mongoose from "mongoose";
import Project from "../models/Project.js";
import Category from "../models/Category.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

/**
 * GET /api/projects
 * Get all projects, optionally filtered by category (id or slug)
 */
export const getProjects = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) filter.category = cat._id;
      }
    }
    if (featured === "true") filter.featured = true;

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/projects/:id
 * Get single project by ID
 */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/projects
 * Create a new project (with optional image uploads)
 */
const parseArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return val ? val.split(",").map((s) => s.trim()).filter(Boolean) : [];
    }
  }
  return [];
};

export const createProject = async (req, res) => {
  try {
    const { title, description, category, link, repoUrl, techStack, additionalTools, featured, order } = req.body;

    const images = [];

    // If files were uploaded, push to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { url, publicId } = await uploadToCloudinary(file.buffer);
        images.push({ url, publicId, alt: file.originalname });
      }
    }

    // Support images passed as URLs (imageUrls from admin form, or images)
    const rawUrls = req.body.imageUrls || req.body.images;
    const bodyImages = rawUrls ? (typeof rawUrls === "string" ? JSON.parse(rawUrls || "[]") : rawUrls) : [];
    if (Array.isArray(bodyImages) && bodyImages.length > 0) {
      const urlImages = bodyImages.map((img) =>
        typeof img === "string" ? { url: img, publicId: "", alt: "" } : img
      );
      images.push(...urlImages);
    }

    const project = await Project.create({
      title,
      description,
      category,
      link: link || "",
      repoUrl: repoUrl || "",
      techStack: parseArray(techStack),
      additionalTools: parseArray(additionalTools),
      images,
      featured: featured === true || featured === "true",
      order: parseInt(order, 10) || 0,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * PUT /api/projects/:id
 * Update a project
 */
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * DELETE /api/projects/:id
 * Delete a project
 */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
