const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    courseTitle: {
      type: String,
      required: true,
    },
    courseImage: {
      type: String,
      default: null,
    },
    instructor: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: "",
    },
    level: {
      type: String,
      default: "All Levels",
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate wishlist items
wishlistSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Index for better query performance
wishlistSchema.index({ userId: 1 });

module.exports = mongoose.model("Wishlist", wishlistSchema);
