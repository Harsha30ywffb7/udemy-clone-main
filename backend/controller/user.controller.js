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
    const { fullName, name, email, password, userType = "student" } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Handle name field - support both fullName and name object
    let firstName = "";
    let lastName = "";

    if (name && name.first && name.last) {
      // New format: { name: { first: "John", last: "Doe" } }
      firstName = name.first.trim();
      lastName = name.last.trim();
    } else if (fullName) {
      // Legacy format: { fullName: "John Doe" }
      const nameParts = fullName.trim().split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Name is required. Please provide either 'name' object with 'first' and 'last' properties, or 'fullName' string",
      });
    }

    // Validate name fields
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Both first name and last name are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user data with new schema structure
    const userData = {
      name: {
        first: firstName,
        last: lastName,
      },
      email: email.toLowerCase(),
      passwordHash,
      role: userType,
    };

    // Add role-specific initial data
    if (userType === "instructor") {
      userData.instructorProfile = {
        headline: "",
        expertise: [],
        payoutEmail: null,
        totalStudents: 0,
        totalCourses: 0,
        averageRating: 0,
        totalReviews: 0,
        totalEarnings: 0,
        isVerified: false,
        verificationDate: null,
      };
    } else {
      userData.enrolledCourses = [];
    }

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data without sensitive information
    const userResponse = {
      _id: user._id,
      name: user.name,
      fullName: user.fullName, // Virtual field
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      instructorProfile: user.instructorProfile,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data without sensitive information
    const userResponse = {
      _id: user._id,
      name: user.name,
      fullName: user.fullName, // Virtual field
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      instructorProfile: user.instructorProfile,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
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
    // if (req.user.userType !== "instructor") {
    //   return res
    //     .status(403)
    //     .json({ message: "Only instructors can complete onboarding" });
    // }

    // Update user with onboarding data
    const updateData = {
      isOnBoarded: true,
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
