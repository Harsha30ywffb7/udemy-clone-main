const express = require("express");

const Wishlist = require("../models/wishlist.model");
const Course = require("../models/course.model");

const router = express.Router();

// Get user's wishlist
router.get("/", async (req, res) => {
  try {
    const user = req.user;
    const wishlist = user.wishlist;

    const courses = await Course.find({ _id: { $in: wishlist } });
    res.json({ wishlist: courses });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add course to wishlist
router.post("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (user.wishlist.includes(courseId)) {
      return res.status(400).json({ message: "Course already in wishlist" });
    }

    user.wishlist.push(courseId);
    await user.save();

    res.status(201).json({
      message: "Course added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove course from wishlist
router.delete("/:courseId", async (req, res) => {
  try {
    console.log("reached delete wishlist");
    const user = req.user;
    const { courseId } = req.params;

    user.wishlist = user.wishlist.filter(
      (id) => courseId.toString() !== id.toString()
    );

    await user.save();

    res.json({
      message: "Course removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check if course is in wishlist
router.get("/check/:courseId", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const wishlistItem = await Wishlist.findOne({ userId, courseId });

    res.json({
      isInWishlist: !!wishlistItem,
      wishlistItem: wishlistItem || null,
    });
  } catch (error) {
    console.error("Check wishlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Clear entire wishlist
router.delete("/", async (req, res) => {
  try {
    const userId = req.user.userId;

    await Wishlist.deleteMany({ userId });

    res.json({ message: "Wishlist cleared successfully" });
  } catch (error) {
    console.error("Clear wishlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
