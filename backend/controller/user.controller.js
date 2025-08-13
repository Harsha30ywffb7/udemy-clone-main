require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { authenticate } = require("../middlewares/authenticate");

const router = express.Router();

// Register new user (student or instructor)
router.post("/register", async (req, res) => {
  try {
    const fullName = req.body.fullName || req.body.name; // accept both keys
    const { email, password, userType = "student" } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "fullName, email and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user based on type
    const userData = {
      fullName,
      email,
      password: hashedPassword,
      userType,
    };

    // Add type-specific initial data
    if (userType === "instructor") {
      userData.instructorProfile = {
        expertise: [],
        experience: 0,
        totalStudents: 0,
        rating: 0,
        totalCourses: 0,
      };
    } else {
      userData.studentProfile = {
        enrolledCourses: [],
        completedCourses: [],
        learningGoals: [],
      };
    }

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data without password
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      profileImage: user.profileImage,
      bio: user.bio,
      instructorProfile: user.instructorProfile,
      studentProfile: user.studentProfile,
      token,
    };

    res.status(201).json({
      message: "User registered successfully",
      token, // top-level token for compatibility
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  console.log("reached the login page");
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: "Account is deactivated" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data without password
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      profileImage: user.profileImage,
      bio: user.bio,
      instructorProfile: user.instructorProfile,
      studentProfile: user.studentProfile,
      token,
    };

    res.json({
      message: "Login successful",
      token, // top-level token for compatibility
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, bio, profileImage, learningGoals } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    // Update student-specific data
    if (req.user.userType === "student" && learningGoals) {
      updateData["studentProfile.learningGoals"] = learningGoals;
    }

    // Update instructor-specific data
    if (req.user.userType === "instructor" && req.body.expertise) {
      updateData["instructorProfile.expertise"] = req.body.expertise;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all instructors (for student browsing)
router.get("/instructors", async (req, res) => {
  try {
    const instructors = await User.find({
      userType: "instructor",
      isActive: true,
    }).select("fullName bio profileImage instructorProfile");

    res.json({ instructors });
  } catch (error) {
    console.error("Get instructors error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get instructor profile by ID
router.get("/instructor/:id", async (req, res) => {
  try {
    const instructor = await User.findOne({
      _id: req.params.id,
      userType: "instructor",
      isActive: true,
    }).select("-password");

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.json({ instructor });
  } catch (error) {
    console.error("Get instructor error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Mark instructor as onboarded
router.put("/onboard", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { onboardingAnswers } = req.body;

    // Check if user is an instructor
    if (req.user.userType !== "instructor") {
      return res
        .status(403)
        .json({ message: "Only instructors can complete onboarding" });
    }

    // Update user with onboarding data
    const updateData = {
      isOnboarded: true,
      "instructorProfile.onboardingAnswers": onboardingAnswers,
    };

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Onboarding completed successfully",
      user,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
