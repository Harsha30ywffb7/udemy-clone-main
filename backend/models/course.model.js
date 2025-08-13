const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseType: {
      type: String,
      enum: ["course", "practice-test"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    timeCommitment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    sections: [
      {
        title: String,
        lectures: [
          {
            title: String,
            type: {
              type: String,
              enum: ["video", "text", "quiz"],
              default: "video",
            },
            content: String,
            duration: Number, // in minutes
            isPreview: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
    requirements: [String],
    learningOutcomes: [String],
    targetAudience: [String],
    language: {
      type: String,
      default: "English",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "All Levels",
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0, // in minutes
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
courseSchema.index({ instructor: 1, status: 1 });
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ title: "text" });

module.exports = mongoose.model("Course", courseSchema);
