const express = require("express");
const router = express.Router();
const Course = require("../models/course.model");
const Instructor = require("../models/instructor.model");
const Category = require("../models/category.model");
const { authenticate } = require("../middlewares/authenticate");

// ==================== API ENDPOINTS ====================

// Get course basic data (for sidebar and header)
router.get("/:id/basic", async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("instructorId", "name")
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const basicData = {
      title: course.title,
      headline: course.subtitle,
      visible_instructors: [
        {
          title: course.instructorId?.name
            ? `${course.instructorId.name.first} ${course.instructorId.name.last}`
            : "Unknown Instructor",
        },
      ],
      rating: course.rating || 0,
      total_ratings: course.totalRatings || 0,
      total_students: course.totalStudents || 0,
      price: course.price || 0,
      originalPrice: course.originalPrice || course.price,
      discount: course.originalPrice
        ? Math.round(
            ((course.originalPrice - course.price) / course.originalPrice) * 100
          )
        : 0,
      thumbnail: course.thumbnailUrl,
      timeLeft: "Limited time offer!",
      subscriptionPrice: course.price,
    };

    res.json({
      success: true,
      data: basicData,
    });
  } catch (error) {
    console.error("Get course basic data error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get course detailed data (for main content)
router.get("/:id/detailed", async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("instructorId", "name")
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const detailedData = {
      primary_category: { title: course.category },
      primary_subcategory: { title: course.subcategory },
      context_info: { label: { title: course.category } },
      bestseller_badge_content: {
        badge_text: course.totalStudents > 100000 ? "Bestseller" : "",
      },
      last_update_date: course.updatedAt
        ? course.updatedAt.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      caption_languages: [course.language || "English"],
      description: course.description,
      requirements: course.requirements || [],
      learningObjectives: course.learningObjectives || [],
      level: course.level,
      duration: course.duration || 0,
      totalLectures: course.totalLectures || 0,
    };

    res.json({
      success: true,
      data: detailedData,
    });
  } catch (error) {
    console.error("Get course detailed data error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get course curriculum/sections
router.get("/:id/curriculum", async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Return basic curriculum structure
    const curriculumData = {
      sections: course.sections || [],
      totalLectures: course.totalLectures || 0,
      totalDuration: course.duration || 0,
    };

    res.json({
      success: true,
      data: curriculumData,
    });
  } catch (error) {
    console.error("Get course curriculum error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get course instructor data
router.get("/:id/instructor", async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("instructorId", "name")
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get instructor profile
    const instructor = await Instructor.findOne({
      user: course.instructorId._id,
    }).lean();

    const instructorData = {
      name: course.instructorId?.name
        ? `${course.instructorId.name.first} ${course.instructorId.name.last}`
        : "Unknown Instructor",
      title: instructor?.title || "Expert Instructor",
      bio:
        instructor?.bio?.full ||
        "Experienced instructor passionate about teaching.",
      image: instructor?.profileImage || null,
      totalStudents: instructor?.totalStudents || 0,
      totalCourses: instructor?.totalCourses || 1,
      socialLinks: instructor?.socialLinks || {},
    };

    res.json({
      success: true,
      data: instructorData,
    });
  } catch (error) {
    console.error("Get course instructor error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get course reviews
router.get("/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 8, rating } = req.query;

    const course = await Course.findById(id).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Since we removed reviews from the schema, return empty reviews with course rating info
    const reviewsData = {
      averageRating: course.rating || 0,
      totalRatings: course.totalRatings || 0,
      ratingBreakdown: {
        5: Math.floor((course.totalRatings || 0) * 0.6),
        4: Math.floor((course.totalRatings || 0) * 0.25),
        3: Math.floor((course.totalRatings || 0) * 0.1),
        2: Math.floor((course.totalRatings || 0) * 0.03),
        1: Math.floor((course.totalRatings || 0) * 0.02),
      },
      reviews: [], // Empty since we removed reviews
      pagination: {
        currentPage: parseInt(page),
        totalPages: 0,
        totalReviews: 0,
        hasMore: false,
      },
    };

    res.json({
      success: true,
      data: reviewsData,
    });
  } catch (error) {
    console.error("Get course reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get recommended courses (students also bought)
router.get("/:id/recommended", async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 6 } = req.query;

    const currentCourse = await Course.findById(id).lean();

    if (!currentCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Find courses in the same category, excluding the current course
    const recommendedCourses = await Course.find({
      _id: { $ne: id },
      category: currentCourse.category,
      status: "published",
      isActive: true,
    })
      .populate("instructorId", "name")
      .limit(parseInt(limit))
      .lean();

    // Transform to match expected format
    const transformedCourses = recommendedCourses.map((course) => ({
      id: course._id,
      title: course.title,
      headline: course.subtitle,
      instructor: {
        name: course.instructorId?.name
          ? `${course.instructorId.name.first} ${course.instructorId.name.last}`
          : "Unknown Instructor",
      },
      rating: course.rating || 0,
      totalRatings: course.totalRatings || 0,
      totalStudents: course.totalStudents || 0,
      price: course.price || 0,
      originalPrice: course.originalPrice || course.price,
      thumbnail: course.thumbnailUrl,
      category: course.category,
      level: course.level,
    }));

    res.json({
      success: true,
      data: transformedCourses,
    });
  } catch (error) {
    console.error("Get recommended courses error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get related topics
router.get("/:id/related-topics", async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Generate related topics based on course category and subcategory
    const relatedTopics = [
      course.category,
      course.subcategory,
      course.topic,
    ].filter(Boolean);

    // Add some generic related topics based on category
    if (course.category === "Development") {
      relatedTopics.push(
        "Web Development",
        "Programming",
        "Software Development"
      );
    } else if (course.category === "IT & Software") {
      relatedTopics.push("Cloud Computing", "DevOps", "System Administration");
    }

    // Remove duplicates and limit to 8 topics
    const uniqueTopics = [...new Set(relatedTopics)].slice(0, 8);

    res.json({
      success: true,
      data: uniqueTopics,
    });
  } catch (error) {
    console.error("Get related topics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get course categories breadcrumb
router.get("/:id/categories", async (req, res) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const categories = {
      primary: "Development",
      subcategory: "Web Development",
      context: "Web Development",
    };

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get course categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get course preview content (for preview videos/articles)
router.get("/:id/preview/:contentId", async (req, res) => {
  try {
    const { contentId } = req.params;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock preview content
    const previewContent = {
      id: contentId,
      title: "Welcome to the Course",
      type: "video",
      url: "https://example.com/preview-video.mp4",
      duration: "5:30",
      thumbnail: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
      description: "This is a preview of the course content.",
    };

    res.json({
      success: true,
      data: previewContent,
    });
  } catch (error) {
    console.error("Get course preview error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get course statistics
router.get("/:id/stats", async (req, res) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const stats = {
      totalStudents: 1486975,
      totalRatings: 448887,
      averageRating: 4.7,
      completionRate: 78.5,
      lastUpdated: "2025-02-01",
      totalLectures: 42,
      totalDuration: "21h 15m",
      totalSections: 7,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get course stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get instructor's courses
router.get("/instructor/my-courses", authenticate, async (req, res) => {
  try {
    console.log("user role state", req.user);
    // Only instructors can access their courses
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can access this endpoint",
      });
    }

    // Fetch real courses from database for the authenticated user
    console.log(req.user.id);

    const courses = await Course.find({
      instructorId: req.user.id,
    }).select(
      "title subtitle thumbnailUrl price status createdAt viewCount enrollmentCount sections"
    );

    console.log(courses);

    // Function to calculate course completion percentage
    const calculateCompletionPercentage = (course) => {
      const requiredFields = {
        title: !!course.title,
        subtitle: !!course.subtitle,
        thumbnailUrl: !!course.thumbnailUrl,
        price: course.price >= 0,
        sections: course.sections && course.sections.length > 0,
      };

      const sectionsWithContent = course.sections
        ? course.sections.filter(
            (section) => section.content && section.content.length > 0
          ).length
        : 0;

      const totalRequiredSteps = 5; // Basic course info steps
      const completedSteps =
        Object.values(requiredFields).filter(Boolean).length;
      const contentProgress = sectionsWithContent > 0 ? 1 : 0; // 1 point for having content

      return Math.round(
        ((completedSteps + contentProgress) / (totalRequiredSteps + 1)) * 100
      );
    };

    // Transform the data to match frontend expectations
    const instructorCourses = courses.map((course) => ({
      id: course._id,
      title: course.title,
      subtitle: course.subtitle,
      status: course.status.toUpperCase(),
      visibility: "Public", // Default visibility
      progress: calculateCompletionPercentage(course),
      isCompleted: course.status === "published",
      totalStudents: course.enrollmentCount || 0,
      rating: 0, // You can add rating logic later
      totalRatings: 0, // You can add rating logic later
      price: course.price,
      thumbnail: course.thumbnailUrl,
      createdAt: course.createdAt,
    }));

    res.json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error("Get instructor courses error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get instructor's courses (alternative endpoint for frontend compatibility)
router.get("/instructor", authenticate, async (req, res) => {
  try {
    // Only instructors can access their courses
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can access this endpoint",
      });
    }

    // Fetch real courses from database for the authenticated user
    const courses = await Course.find({
      instructorId: req.user.id,
    }).select(
      "title subtitle thumbnailUrl price status createdAt viewCount enrollmentCount"
    );

    // Transform the data to match frontend expectations
    const instructorCourses = courses.map((course) => ({
      id: course._id,
      title: course.title,
      status: course.status,
      totalStudents: course.enrollmentCount || 0,
      rating: 0, // You can add rating logic later
      totalRatings: 0, // You can add rating logic later
      price: course.price,
      thumbnail: course.thumbnailUrl,
      createdAt: course.createdAt,
    }));

    res.json({
      success: true,
      courses: instructorCourses,
    });
  } catch (error) {
    console.error("Get instructor courses error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ==================== EXISTING ENDPOINTS (KEPT FOR COMPATIBILITY) ====================

// Get a specific course by ID (legacy endpoint)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("instructorId", "name")
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get instructor profile
    const instructor = await Instructor.findOne({
      user: course.instructorId._id,
    }).lean();

    const courseData = {
      id: course._id,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      category: course.category,
      subcategory: course.subcategory,
      level: course.level,
      language: course.language,
      rating: course.rating || 0,
      totalRatings: course.totalRatings || 0,
      totalStudents: course.totalStudents || 0,
      price: course.price || 0,
      originalPrice: course.originalPrice || course.price,
      thumbnailUrl: course.thumbnailUrl,
      duration: course.duration || 0,
      totalLectures: course.totalLectures || 0,
      requirements: course.requirements || [],
      learningObjectives: course.learningObjectives || [],
      sections: course.sections || [],
      instructor: {
        name: course.instructorId?.name
          ? `${course.instructorId.name.first} ${course.instructorId.name.last}`
          : "Unknown Instructor",
        title: instructor?.title || "Expert Instructor",
        bio:
          instructor?.bio?.full ||
          "Experienced instructor passionate about teaching.",
        image: instructor?.profileImage || null,
        totalStudents: instructor?.totalStudents || 0,
        totalCourses: instructor?.totalCourses || 1,
        socialLinks: instructor?.socialLinks || {},
      },
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };

    res.json({
      success: true,
      data: courseData,
    });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get all published courses (for students)
router.get("/", async (req, res) => {
  try {
    const {
      category,
      level,
      search,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    // Build query
    let query = { status: "published", isActive: true };

    // Apply filters
    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case "rating":
        sortObj = { rating: -1 };
        break;
      case "students":
        sortObj = { totalStudents: -1 };
        break;
      case "price":
        sortObj = { price: 1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      default: // newest
        sortObj = { createdAt: -1 };
        break;
    }

    // Get total count for pagination
    const totalCourses = await Course.countDocuments(query);

    // Fetch courses with pagination
    const courses = await Course.find(query)
      .populate("instructorId", "name")
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Transform data to match frontend expectations
    const transformedCourses = courses.map((course) => ({
      id: course._id,
      title: course.title,
      headline: course.subtitle,
      desc: course.description,
      instructor: {
        name: course.instructorId?.name
          ? `${course.instructorId.name.first} ${course.instructorId.name.last}`
          : "Unknown Instructor",
      },
      rating: course.rating || 0,
      rateScore: course.rating || 0,
      totalRatings: course.totalRatings || 0,
      reviewerNum: course.totalRatings || 0,
      totalStudents: course.totalStudents || 0,
      price: course.price || 0,
      originalPrice: course.originalPrice || course.price,
      img: course.thumbnailUrl,
      thumbnail: course.thumbnailUrl,
      category: course.category,
      level: course.level,
      createdAt: course.createdAt,
      duration: course.duration,
      totalLectures: course.totalLectures,
    }));

    res.json({
      success: true,
      data: {
        courses: transformedCourses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCourses / limit),
          totalCourses: totalCourses,
          hasMore: page * limit < totalCourses,
        },
      },
    });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Create new course (landing page data)
router.post("/", authenticate, async (req, res) => {
  try {
    // Only instructors can create courses
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can create courses",
      });
    }

    const {
      title,
      subtitle,
      description,
      category,
      subcategory,
      topic,
      language,
      level,
      thumbnailUrl,
      promoVideoUrl,
      price,
      originalPrice,
      learningObjectives,
      requirements,
      targetAudience,
      keywords,
      status, // Add status to destructuring
    } = req.body;

    console.log("📝 CREATE COURSE - Request data:", {
      title,
      subtitle,
      description,
      category,
      status,
    });

    // Different validation levels based on course status
    const isDraft = !status || status === "draft";

    if (isDraft) {
      // Minimal validation for draft courses - only require title
      console.log("📝 DRAFT COURSE - Applying minimal validation");
      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Course title is required to create a draft",
        });
      }
    } else {
      // Full validation for published courses
      console.log("📝 PUBLISHED COURSE - Applying full validation");
      if (!title || !subtitle || !description || !category || !thumbnailUrl) {
        return res.status(400).json({
          success: false,
          message:
            "Title, subtitle, description, category, and thumbnail are required for published courses",
        });
      }

      if (description && description.length < 200) {
        return res.status(400).json({
          success: false,
          message:
            "Description must be at least 200 characters for published courses",
        });
      }

      if (
        !learningObjectives ||
        learningObjectives.filter((obj) => obj && obj.trim()).length < 4
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least 4 learning objectives are required for published courses",
        });
      }
    }

    const newCourse = new Course({
      title: title ? title.trim() : "",
      subtitle: subtitle ? subtitle.trim() : "",
      description: description ? description.trim() : "",
      category: category || "",
      subcategory: subcategory || "",
      topic: topic || "",
      language: language || "English",
      level: level || "Beginner",
      thumbnailUrl: thumbnailUrl || "",
      promoVideoUrl: promoVideoUrl || "",
      price: parseFloat(price) || 0,
      originalPrice: parseFloat(originalPrice) || parseFloat(price) || 0,
      instructorId: req.user.id,
      learningObjectives: learningObjectives
        ? learningObjectives.filter((obj) => obj && obj.trim())
        : [],
      requirements: requirements
        ? requirements.filter((req) => req && req.trim())
        : [],
      targetAudience: targetAudience
        ? targetAudience.filter((aud) => aud && aud.trim())
        : [],
      keywords: keywords ? keywords.filter((kw) => kw && kw.trim()) : [],
      status: status || "draft", // Default to draft if not specified
      sections: [], // Will be populated in curriculum step
      completedSteps: status === "draft" ? ["landing-page"] : [], // Track completed steps
    });

    console.log("💾 CREATING COURSE:", {
      title: newCourse.title,
      status: newCourse.status,
      instructorId: newCourse.instructorId,
    });

    const savedCourse = await newCourse.save();

    console.log("✅ COURSE CREATED SUCCESSFULLY:", savedCourse._id);

    res.status(201).json({
      success: true,
      message: `Course ${isDraft ? "draft created" : "created"} successfully`,
      data: {
        _id: savedCourse._id,
        id: savedCourse._id,
        courseId: savedCourse._id,
        title: savedCourse.title,
        status: savedCourse.status,
        completedSteps: savedCourse.completedSteps || [],
      },
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Update course landing page
router.put("/:id/landing-page", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Only instructors can update courses
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can update courses",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Verify the instructor owns this course
    if (course.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own courses",
      });
    }

    const {
      title,
      subtitle,
      description,
      category,
      subcategory,
      topic,
      language,
      level,
      thumbnailUrl,
      promoVideoUrl,
      price,
      originalPrice,
      learningObjectives,
      requirements,
      targetAudience,
      keywords,
    } = req.body;

    // Validation
    if (title && title.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 10 characters",
      });
    }

    if (description && description.length < 200) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 200 characters",
      });
    }

    // Update fields
    if (title) course.title = title.trim();
    if (subtitle) course.subtitle = subtitle.trim();
    if (description) course.description = description.trim();
    if (category) course.category = category;
    if (subcategory !== undefined) course.subcategory = subcategory;
    if (topic !== undefined) course.topic = topic;
    if (language) course.language = language;
    if (level) course.level = level;
    if (thumbnailUrl) course.thumbnailUrl = thumbnailUrl;
    if (promoVideoUrl !== undefined) course.promoVideoUrl = promoVideoUrl;
    if (price !== undefined) course.price = parseFloat(price) || 0;
    if (originalPrice !== undefined)
      course.originalPrice = parseFloat(originalPrice) || course.price;
    if (learningObjectives)
      course.learningObjectives = learningObjectives.filter((obj) =>
        obj.trim()
      );
    if (requirements)
      course.requirements = requirements.filter((req) => req.trim());
    if (targetAudience)
      course.targetAudience = targetAudience.filter((aud) => aud.trim());
    if (keywords) course.keywords = keywords.filter((kw) => kw.trim());

    const updatedCourse = await course.save();

    res.json({
      success: true,
      message: "Course landing page updated successfully",
      data: {
        courseId: updatedCourse._id,
        title: updatedCourse.title,
        subtitle: updatedCourse.subtitle,
        status: updatedCourse.status,
      },
    });
  } catch (error) {
    console.error("Update course landing page error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get course for editing (landing page data)
router.get("/:id/edit", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Only instructors can edit courses
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can edit courses",
      });
    }

    const course = await Course.findById(id).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Verify the instructor owns this course
    if (course.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own courses",
      });
    }

    res.json({
      success: true,
      data: {
        courseId: course._id,
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        category: course.category,
        subcategory: course.subcategory,
        topic: course.topic,
        language: course.language,
        level: course.level,
        thumbnailUrl: course.thumbnailUrl,
        promoVideoUrl: course.promoVideoUrl,
        price: course.price,
        originalPrice: course.originalPrice,
        learningObjectives: course.learningObjectives,
        requirements: course.requirements,
        targetAudience: course.targetAudience,
        keywords: course.keywords,
        status: course.status,
        totalSections: course.sections?.length || 0,
        totalLectures: course.totalLectures,
        totalDuration: course.totalDuration,
      },
    });
  } catch (error) {
    console.error("Get course for editing error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Update a course (instructor only)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const courseId = req.params.id;

    // Only instructors can update courses
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can update courses",
      });
    }

    // Simulate course update
    const updatedCourse = {
      id: courseId,
      ...req.body,
      updatedAt: new Date(),
    };

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Delete a course (instructor only)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const courseId = req.params.id;

    // Only instructors can delete courses
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can delete courses",
      });
    }

    // Simulate course deletion
    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update course curriculum
router.put("/:id/curriculum", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { sections } = req.body;

    // Only instructors can update their courses
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can update course curriculum",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Verify the instructor owns this course
    if (course.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own courses",
      });
    }

    // Update sections with proper structure
    const updatedSections = sections.map((section, index) => ({
      title: section.title,
      description: section.description || "",
      sortOrder: index,
      isPublished: section.isPublished || false,
      content: (section.content || []).map((content, contentIndex) => ({
        contentType: content.contentType,
        title: content.title,
        description: content.description || "",
        duration: content.duration || 0,
        isPreview: content.isPreview || false,
        isFree: content.isFree || false,
        sortOrder: contentIndex,

        // Content-specific data
        ...(content.video && { video: content.video }),
        ...(content.slides && { slides: content.slides }),
        ...(content.document && { document: content.document }),
        ...(content.article && { article: content.article }),
        ...(content.quiz && { quiz: content.quiz }),
        ...(content.codingExercise && {
          codingExercise: content.codingExercise,
        }),
        ...(content.assignment && { assignment: content.assignment }),
        ...(content.resources && { resources: content.resources }),
      })),
      analytics: {
        totalDuration: (section.content || []).reduce(
          (total, content) => total + (content.duration || 0),
          0
        ),
        totalContent: (section.content || []).length,
        averageCompletionRate: 0,
      },
    }));

    course.sections = updatedSections;

    // Update course statistics
    course.updateStatistics();
    await course.save();

    res.json({
      success: true,
      message: "Curriculum updated successfully",
      data: {
        sections: course.sections,
        totalDuration: course.totalDuration,
        totalLectures: course.totalLectures,
        totalQuizzes: course.totalQuizzes,
        totalAssignments: course.totalAssignments,
      },
    });
  } catch (error) {
    console.error("Update curriculum error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Upload course content file (video, slides, documents)
router.post("/:id/upload", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { sectionId, contentId, fileType } = req.body;

    // Only instructors can upload files
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can upload course content",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Verify the instructor owns this course
    if (course.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only upload to your own courses",
      });
    }

    // For now, return a mock response since we don't have actual file upload setup
    // In production, you would integrate with AWS S3, Google Cloud Storage, etc.
    const mockFileUrl = `https://storage.example.com/courses/${id}/${sectionId}/${contentId}/${fileType}_${Date.now()}`;

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: mockFileUrl,
        fileType,
        uploadStatus: "completed",
        size: Math.floor(Math.random() * 100000000), // Mock file size
      },
    });
  } catch (error) {
    console.error("Upload file error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get course curriculum for editing
router.get("/:id/curriculum/edit", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Only instructors can edit curriculum
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can edit course curriculum",
      });
    }

    const course = await Course.findById(id).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Verify the instructor owns this course
    if (course.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own courses",
      });
    }

    res.json({
      success: true,
      data: {
        courseId: course._id,
        title: course.title,
        sections: course.sections || [],
        totalDuration: course.totalDuration,
        totalLectures: course.totalLectures,
        totalQuizzes: course.totalQuizzes,
        totalAssignments: course.totalAssignments,
      },
    });
  } catch (error) {
    console.error("Get curriculum for editing error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Bulk upload endpoint for multiple files
router.post("/:id/bulk-upload", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { files, sectionId } = req.body;

    // Only instructors can bulk upload
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can bulk upload course content",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Verify the instructor owns this course
    if (course.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only upload to your own courses",
      });
    }

    // Mock bulk upload processing
    const uploadResults = files.map((file, index) => ({
      filename: file.name,
      url: `https://storage.example.com/courses/${id}/${sectionId}/bulk_${Date.now()}_${index}`,
      uploadStatus: "completed",
      size: Math.floor(Math.random() * 100000000),
      contentType: file.type.startsWith("video/")
        ? "video"
        : file.type.includes("presentation") || file.type.includes("pdf")
        ? "document"
        : "article",
    }));

    res.json({
      success: true,
      message: `${files.length} files uploaded successfully`,
      data: {
        uploads: uploadResults,
        totalFiles: files.length,
        successfulUploads: uploadResults.length,
      },
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get content analytics
router.get("/:id/analytics/content", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Calculate content analytics
    const analytics = {
      totalSections: course.sections?.length || 0,
      totalContent:
        course.totalLectures + course.totalQuizzes + course.totalAssignments,
      totalDuration: course.totalDuration,
      contentBreakdown: {
        videos: 0,
        articles: 0,
        quizzes: 0,
        assignments: 0,
        codingExercises: 0,
      },
      sectionAnalytics: [],
    };

    // Analyze each section
    course.sections?.forEach((section) => {
      const sectionAnalytics = {
        sectionId: section._id,
        title: section.title,
        contentCount: section.content?.length || 0,
        duration: section.analytics?.totalDuration || 0,
        isPublished: section.isPublished,
        completionRate: section.analytics?.averageCompletionRate || 0,
      };

      // Count content types in this section
      section.content?.forEach((content) => {
        switch (content.contentType) {
          case "video":
          case "video_slide_mashup":
            analytics.contentBreakdown.videos++;
            break;
          case "article":
            analytics.contentBreakdown.articles++;
            break;
          case "quiz":
          case "practice_test":
            analytics.contentBreakdown.quizzes++;
            break;
          case "assignment":
            analytics.contentBreakdown.assignments++;
            break;
          case "coding_exercise":
            analytics.contentBreakdown.codingExercises++;
            break;
        }
      });

      analytics.sectionAnalytics.push(sectionAnalytics);
    });

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Get content analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
