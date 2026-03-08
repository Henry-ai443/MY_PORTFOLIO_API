/**
 * Seed script - run with: node scripts/seed.js
 * Requires: MONGODB_URI in .env
 *
 * Creates sample categories and projects. Update with your real data.
 */
import "dotenv/config";
import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Project from "../src/models/Project.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";

async function seed() {
  await mongoose.connect(MONGODB_URI);

  // Clear existing
  await Category.deleteMany({});
  await Project.deleteMany({});

  const webApps = await Category.create({ name: "Web Applications", order: 1 });
  const mobile = await Category.create({ name: "Mobile Apps", order: 2 });
  const other = await Category.create({ name: "Other", order: 3 });

  await Project.create([
    {
      title: "General Conference Youth Portal",
      short_description: "A comprehensive youth portal for the General Conference featuring events, resources, and community engagement tools.",
      description: "A youth-focused portal for the General Conference with events, resources, and community features.",
      category: webApps._id,
      link: "https://generalconferenceyouthportal.vercel.app/",
      techStack: ["React", "Node.js", "MongoDB"],
      additionalTools: ["Vercel", "Figma"],
      images: [{ url: "https://via.placeholder.com/600x400?text=Project+1", publicId: "", alt: "General Conference Youth Portal" }],
      featured: true,
      order: 1,
    },
    {
      title: "Terra Smart",
      short_description: "Smart agricultural platform for land management and farming optimization.",
      description: "Smart agricultural and land management platform.",
      category: webApps._id,
      link: "https://terrasmart.vercel.app/",
      techStack: ["React", "JavaScript", "CSS"],
      additionalTools: ["Vercel"],
      images: [{ url: "https://via.placeholder.com/600x400?text=Project+2", publicId: "", alt: "Terra Smart" }],
      featured: true,
      order: 2,
    },
  ]);

  console.log("Seed completed. Categories and projects created.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
