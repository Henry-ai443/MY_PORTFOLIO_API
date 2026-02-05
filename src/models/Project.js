import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Project category is required"],
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
    repoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    techStack: {
      type: [String],
      default: [],
    },
    additionalTools: {
      type: [String],
      default: [],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          default: "",
        },
        alt: {
          type: String,
          default: "",
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Populate category when querying
projectSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name slug",
  });
  next();
});

export default mongoose.model("Project", projectSchema);
