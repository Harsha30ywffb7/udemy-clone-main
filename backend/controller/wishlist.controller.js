const express = require("express");
const Wishlist = require("../models/wishlist.model");

const router = express.Router();

// Get user's wishlist
router.get("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const wishlist = await Wishlist.find({ userId }).sort({ addedAt: -1 });

    res.json({ wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add course to wishlist
router.post("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      courseId,
      courseTitle,
      courseImage,
      instructor,
      rating,
      totalStudents,
      category,
      level,
    } = req.body;

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({ userId, courseId });
    if (existingItem) {
      return res.status(400).json({ message: "Course already in wishlist" });
    }

    const wishlistItem = new Wishlist({
      userId,
      courseId,
      courseTitle,
      courseImage,
      instructor,
      rating,
      totalStudents,
      category,
      level,
    });

    await wishlistItem.save();

    res.status(201).json({
      message: "Course added to wishlist",
      wishlistItem,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove course from wishlist
router.delete("/:courseId", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const deletedItem = await Wishlist.findOneAndDelete({ userId, courseId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Course not found in wishlist" });
    }

    res.json({ message: "Course removed from wishlist" });
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
