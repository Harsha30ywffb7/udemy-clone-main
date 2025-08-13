const express = require("express");
const router = express.Router();
const Course = require("../models/course.model");
const { authenticate } = require("../middlewares/authenticate");

// Create a new course
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      title,
      courseType,
      category,
      timeCommitment,
      status = "draft",
    } = req.body;
    const instructorId = req.user.userId;

    // Check if user is an instructor
    if (req.user.userType !== "instructor") {
      return res
        .status(403)
        .json({ message: "Only instructors can create courses" });
    }

    const course = new Course({
      title,
      instructor: instructorId,
      courseType,
      category,
      timeCommitment,
      status,
    });

    await course.save();

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all courses for an instructor
router.get("/instructor", authenticate, async (req, res) => {
  try {
    const instructorId = req.user.userId;

    // Check if user is an instructor
    if (req.user.userType !== "instructor") {
      return res
        .status(403)
        .json({ message: "Only instructors can access this endpoint" });
    }

    const courses = await Course.find({ instructor: instructorId })
      .sort({ createdAt: -1 })
      .populate("instructor", "fullName email");

    res.json({ courses });
  } catch (error) {
    console.error("Get instructor courses error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a specific course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "fullName email bio profileImage"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ course });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a course
router.put("/:id", authenticate, async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructorId = req.user.userId;

    // Check if user is an instructor
    if (req.user.userType !== "instructor") {
      return res
        .status(403)
        .json({ message: "Only instructors can update courses" });
    }

    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a course
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructorId = req.user.userId;

    // Check if user is an instructor
    if (req.user.userType !== "instructor") {
      return res
        .status(403)
        .json({ message: "Only instructors can delete courses" });
    }

    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(courseId);

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all published courses (for students)
router.get("/", async (req, res) => {
  try {
    const { category, level, search } = req.query;
    const filter = { status: "published", isActive: true };

    if (category) {
      filter.category = category;
    }

    if (level) {
      filter.level = level;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const courses = await Course.find(filter)
      .populate("instructor", "fullName bio profileImage")
      .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
