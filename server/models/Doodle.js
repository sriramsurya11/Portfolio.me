import mongoose from "mongoose";

const DoodleSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: [30, "Name cannot exceed 30 characters"],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [40, "Note cannot exceed 40 characters"],
    },
    drawing: {
      type: String,
      required: [true, "Drawing data URL is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent re-compilation of model in Next.js hot-reloading
export default mongoose.models.Doodle || mongoose.model("Doodle", DoodleSchema);
