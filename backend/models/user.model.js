const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    userType: {
      type: String,
      enum: ["instructor", "student"],
      default: "student",
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    // For instructors
    instructorProfile: {
      expertise: [String],
      experience: {
        type: Number,
        default: 0,
      },
      totalStudents: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
      },
      totalCourses: {
        type: Number,
        default: 0,
      },
      onboardingAnswers: {
        type: Object,
        default: {},
      },
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    // For students
    studentProfile: {
      enrolledCourses: [
        {
          courseId: String,
          enrolledAt: {
            type: Date,
            default: Date.now,
          },
          progress: {
            type: Number,
            default: 0,
          },
        },
      ],
      completedCourses: [String],
      learningGoals: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });

module.exports = mongoose.model("User", userSchema);
