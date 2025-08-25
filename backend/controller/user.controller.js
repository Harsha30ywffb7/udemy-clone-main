require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user.model");
const Course = require("../models/course.model");
const { authenticate } = require("../middlewares/authenticate");

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

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
    // The authenticated user object IS the user, so just return it
    // No need to query again since authenticate middleware already fetched the user
    const user = req.user;

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
    console.log("reached profile page");
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

// Wishlist endpoints
router.post("/wishlist/:courseId", authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId).select("_id status");
    if (!course || course.status !== "published") {
      return res.status(404).json({
        success: false,
        message: "Course not found or not published",
      });
    }

    // Check if already in wishlist
    if (user.wishlist && user.wishlist.includes(courseId)) {
      return res.json({
        success: true,
        message: "Course already in wishlist",
      });
    }

    // Add to wishlist
    user.wishlist = user.wishlist || [];
    user.wishlist.push(courseId);
    await user.save();

    res.json({
      success: true,
      message: "Added to wishlist successfully",
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.delete("/wishlist/:courseId", authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { courseId } = req.params;

    // Remove from wishlist
    user.wishlist = user.wishlist || [];
    user.wishlist = user.wishlist.filter(
      (id) => String(id) !== String(courseId)
    );
    await user.save();

    res.json({
      success: true,
      message: "Removed from wishlist successfully",
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/wishlist", authenticate, async (req, res) => {
  try {
    const user = req.user;

    // Get wishlist with course details
    const wishlistCourses = await Course.find({
      _id: { $in: user.wishlist || [] },
      status: "published",
    }).select(
      "_id title subtitle description thumbnailUrl category rating totalStudents totalLectures duration"
    );

    res.json({
      success: true,
      wishlist: wishlistCourses,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/wishlist/check/:courseId", authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { courseId } = req.params;

    const isInWishlist =
      user.wishlist &&
      user.wishlist.some((id) => String(id) === String(courseId));

    res.json({
      success: true,
      isInWishlist,
    });
  } catch (error) {
    console.error("Check wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Enroll in a course
router.post("/courses/:courseId/enroll", authenticate, async (req, res) => {
  try {
    const user = req.user;
    console.log("hits api");
    const { courseId } = req.params;

    const course = await Course.findById(courseId).select(
      "_id category status"
    );
    if (!course || course.status !== "published") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found or not published" });
    }

    const already = (user.enrolledCourses || []).some(
      (c) => String(c.courseId) === String(courseId)
    );
    if (already) {
      return res.json({ success: true, message: "Already enrolled" });
    }

    user.enrolledCourses = user.enrolledCourses || [];
    user.enrolledCourses.push({
      courseId: course._id,
      progress: 0,
      lastAccessed: new Date(),
    });

    // Track enrolled categories for recommendations
    user.enrolledCategories = Array.from(
      new Set(
        [...(user.enrolledCategories || []), course.category].filter(Boolean)
      )
    );

    await user.save();

    // increment course student count
    await Course.findByIdAndUpdate(course._id, { $inc: { totalStudents: 1 } });

    res.json({ success: true, message: "Enrolled successfully" });
  } catch (error) {
    console.error("Enroll error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get enrolled courses
router.get("/enrolled-courses", authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    // Get enrolled course IDs from user
    const enrolledCourseIds = (user.enrolledCourses || []).map(
      (e) => e.courseId
    );

    if (enrolledCourseIds.length === 0) {
      return res.json({
        success: true,
        courses: [],
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    }

    // Fetch course details
    const courses = await Course.find({
      _id: { $in: enrolledCourseIds },
      status: "published",
    })
      .select(
        "_id title subtitle description thumbnailUrl category rating totalStudents totalLectures duration instructorId"
      )
      .populate("instructorId", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      courses,
      total: enrolledCourseIds.length,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Get enrolled courses error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Upload profile picture
router.post(
  "/upload-avatar",
  authenticate,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = req.user;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Only JPEG, PNG, and GIF images are allowed",
        });
      }

      // Validate file size (max 5MB)
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "Image size must be less than 5MB",
        });
      }

      // Generate unique filename
      const fileExtension = req.file.originalname.split(".").pop();
      const fileName = `profile_${user._id}_${Date.now()}.${fileExtension}`;
      const filePath = path.join(__dirname, "../uploads", fileName);

      // Save file
      fs.writeFileSync(filePath, req.file.buffer);

      // Update user profile with image URL
      const imageUrl = `/uploads/${fileName}`;
      user.profilePicture = imageUrl;
      await user.save();

      res.json({
        success: true,
        message: "Profile picture uploaded successfully",
        data: {
          imageUrl,
          fileName,
        },
      });
    } catch (error) {
      console.error("Upload profile picture error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

module.exports = router;
