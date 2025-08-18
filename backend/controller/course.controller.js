const express = require("express");
const router = express.Router();
const Course = require("../models/course.model");
const Instructor = require("../models/instructor.model");
const Category = require("../models/category.model");
const { authenticate } = require("../middlewares/authenticate");

// Dummy data for simulation
const dummyCourseData = {
  title: "The Complete Full-Stack Web Development Bootcamp",
  headline:
    "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps.",
  visible_instructors: [{ title: "Dr. Angela Yu" }],
  rating: 4.7,
  total_ratings: 448887,
  total_students: 1486975,
  price: 479,
  originalPrice: 3109,
  discount: 85,
  thumbnail: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
  timeLeft: "1 day left at this price!",
  subscriptionPrice: 500,
};

const dummyIndividualCourseData = {
  primary_category: { title: "Development" },
  primary_subcategory: { title: "Web Development" },
  context_info: { label: { title: "Web Development" } },
  bestseller_badge_content: { badge_text: "Bestseller" },
  last_update_date: "2025-02-01",
  caption_languages: [
    "English",
    "Arabic [Auto]",
    "French [Auto]",
    "German [Auto]",
    "Italian [Auto]",
    "Portuguese [Auto]",
    "Spanish [Auto]",
    "Turkish [Auto]",
    "Dutch [Auto]",
    "Indonesian [Auto]",
    "Japanese [Auto]",
    "Korean [Auto]",
    "Polish [Auto]",
    "Romanian [Auto]",
    "Russian [Auto]",
    "Swedish [Auto]",
    "Thai [Auto]",
    "Ukrainian [Auto]",
    "Vietnamese [Auto]",
    "Chinese [Auto]",
    "Hindi [Auto]",
    "Hungarian [Auto]",
    "Norwegian [Auto]",
    "Greek [Auto]",
    "Hebrew [Auto]",
    "Czech [Auto]",
    "Danish [Auto]",
  ],
  what_you_will_learn_data: {
    items: [
      "Build 16 web development projects for your portfolio, ready to apply for junior developer jobs.",
      "After the course you will be able to build ANY website you want.",
      "Work as a freelance web developer.",
      "Master backend development with Node",
      "Learn the latest technologies, including Javascript, React, Node and even Web3 development.",
      "Build fully-fledged websites and web apps for your startup or business.",
      "Master frontend development with React",
      "Learn professional developer best practices.",
    ],
  },
  requirements_data: {
    items: [
      "No programming experience needed - I'll teach you everything you need to know",
      "A computer with access to the internet",
      "No paid software required",
      "I'll walk you through, step-by-step how to get all the software installed and set up",
    ],
  },
  description_data: {
    content: `Welcome to the Complete Web Development Bootcamp, the only course you need to learn to code and become a full-stack web developer. With 150,000+ ratings and a 4.8 average, my Web Development course is one of the HIGHEST RATED courses in the history of Udemy!

At 62+ hours, this Web Development course is without a doubt the most comprehensive web development course available online. Even if you have zero programming experience, this course will take you from beginner to mastery. Here's why:

• The course is taught by the lead instructor at the App Brewery, London's leading in-person programming bootcamp.

• The course has been updated to be 2024 ready and you'll be learning the latest tools and technologies used at large companies such as Apple, Google and Netflix.

• The course doesn't cut any corners, there are beautiful animated explanation videos and tens of real-world projects which you will get to build.

• The curriculum was developed over a period of four years, with comprehensive student testing and feedback.

• We've taught over a million students how to code and many have gone on to change their lives by becoming professional developers or starting their own tech startup.

• You'll save yourself over $12,000 by enrolling, but still get access to the same teaching materials and learn from the same instructor and curriculum as our in-person programming bootcamp.

• The course is constantly updated with new content, with new projects and modules determined by students - that's you!

We'll take you step-by-step through engaging video tutorials and teach you everything you need to know to succeed as a web developer.

The course includes over 62 hours of HD video tutorials and builds your programming knowledge while making real-world websites and web apps.

Throughout this comprehensive course, we cover a massive amount of tools and technologies, including:

Front-End Web Development
HTML 5
CSS 3
JavaScript ES6+
Bootstrap 4
Document Object Model (DOM)
jQuery

Backend Web Development
Node.js
NPM
Express.js
REST
APIs
Databases
SQL
MongoDB
Mongoose
Authentication
Firebase
React.js
React Hooks
Web3 Development
Blockchain Development

By the end of this course, you will be fluently programming and be ready to make any website you can dream of.

You'll also build a portfolio of over 16 websites that you can show off to any potential employer.

Sign up today, and look forward to:
• HD video lectures
• Code challenges and coding exercises
• Beautiful real-world projects
• Quizzes and practice tests
• Downloadable programming resources and cheatsheets
• Our best selling 12 Rules to Learn to Code eBook
• $12,000+ web development bootcamp course materials and curriculum

From beginner to expert, you're just a course away!`,
    is_expanded: false,
  },
  course_has_labels: [
    { is_primary: true, label: { title: "Web Development" } },
    { is_primary: true, label: { title: "JavaScript" } },
    { is_primary: false, label: { title: "React" } },
  ],
};

const dummyIncentivesData = {
  curriculum_data: {
    sections: [
      {
        title: "Introduction to Web Development",
        lecture_count: 4,
        content_length: "45min",
        items: [
          {
            title: "Welcome to the Course",
            icon_class: "udi udi-video",
            content_summary: "5min",
            can_be_previewed: true,
          },
          {
            title: "Course Overview and Setup",
            icon_class: "udi udi-video",
            content_summary: "12min",
            can_be_previewed: false,
          },
          {
            title: "Development Environment Setup",
            icon_class: "udi udi-article",
            content_summary: "15min",
            can_be_previewed: false,
          },
          {
            title: "Introduction Quiz",
            icon_class: "udi udi-quiz",
            content_summary: "10min",
            can_be_previewed: false,
          },
        ],
      },
      {
        title: "HTML Fundamentals",
        lecture_count: 5,
        content_length: "2h 15min",
        items: [
          {
            title: "HTML Basics and Structure",
            icon_class: "udi udi-video",
            content_summary: "25min",
            can_be_previewed: false,
          },
          {
            title: "HTML Elements and Tags",
            icon_class: "udi udi-video",
            content_summary: "30min",
            can_be_previewed: false,
          },
          {
            title: "HTML Forms and Input",
            icon_class: "udi udi-video",
            content_summary: "20min",
            can_be_previewed: false,
          },
          {
            title: "HTML Best Practices",
            icon_class: "udi udi-article",
            content_summary: "15min",
            can_be_previewed: false,
          },
          {
            title: "HTML Assignment: Create a Portfolio Page",
            icon_class: "udi udi-assignment",
            content_summary: "45min",
            can_be_previewed: false,
          },
        ],
      },
      {
        title: "CSS Styling and Layout",
        lecture_count: 6,
        content_length: "3h 30min",
        items: [
          {
            title: "CSS Basics and Selectors",
            icon_class: "udi udi-video",
            content_summary: "35min",
            can_be_previewed: false,
          },
          {
            title: "CSS Box Model and Layout",
            icon_class: "udi udi-video",
            content_summary: "40min",
            can_be_previewed: false,
          },
          {
            title: "Flexbox Layout System",
            icon_class: "udi udi-video",
            content_summary: "30min",
            can_be_previewed: false,
          },
          {
            title: "CSS Grid Layout",
            icon_class: "udi udi-video",
            content_summary: "35min",
            can_be_previewed: false,
          },
          {
            title: "Responsive Design Principles",
            icon_class: "udi udi-article",
            content_summary: "20min",
            can_be_previewed: false,
          },
          {
            title: "CSS Assignment: Style Your Portfolio",
            icon_class: "udi udi-assignment",
            content_summary: "60min",
            can_be_previewed: false,
          },
        ],
      },
      {
        title: "JavaScript Programming",
        lecture_count: 6,
        content_length: "4h 15min",
        items: [
          {
            title: "JavaScript Fundamentals",
            icon_class: "udi udi-video",
            content_summary: "45min",
            can_be_previewed: false,
          },
          {
            title: "Variables, Functions, and Scope",
            icon_class: "udi udi-video",
            content_summary: "40min",
            can_be_previewed: false,
          },
          {
            title: "DOM Manipulation",
            icon_class: "udi udi-video",
            content_summary: "35min",
            can_be_previewed: false,
          },
          {
            title: "Event Handling",
            icon_class: "udi udi-video",
            content_summary: "30min",
            can_be_previewed: false,
          },
          {
            title: "JavaScript Quiz: Fundamentals",
            icon_class: "udi udi-quiz",
            content_summary: "20min",
            can_be_previewed: false,
          },
          {
            title: "JavaScript Assignment: Interactive Portfolio",
            icon_class: "udi udi-assignment",
            content_summary: "90min",
            can_be_previewed: false,
          },
        ],
      },
      {
        title: "React.js Framework",
        lecture_count: 6,
        content_length: "5h 20min",
        items: [
          {
            title: "Introduction to React",
            icon_class: "udi udi-video",
            content_summary: "50min",
            can_be_previewed: false,
          },
          {
            title: "React Components and Props",
            icon_class: "udi udi-video",
            content_summary: "45min",
            can_be_previewed: false,
          },
          {
            title: "State and Lifecycle",
            icon_class: "udi udi-video",
            content_summary: "40min",
            can_be_previewed: false,
          },
          {
            title: "React Hooks",
            icon_class: "udi udi-video",
            content_summary: "55min",
            can_be_previewed: false,
          },
          {
            title: "React Router and Navigation",
            icon_class: "udi udi-article",
            content_summary: "25min",
            can_be_previewed: false,
          },
          {
            title: "React Assignment: Build a Todo App",
            icon_class: "udi udi-assignment",
            content_summary: "120min",
            can_be_previewed: false,
          },
        ],
      },
      {
        title: "Backend Development with Node.js",
        lecture_count: 6,
        content_length: "4h 45min",
        items: [
          {
            title: "Introduction to Node.js",
            icon_class: "udi udi-video",
            content_summary: "40min",
            can_be_previewed: false,
          },
          {
            title: "Express.js Framework",
            icon_class: "udi udi-video",
            content_summary: "45min",
            can_be_previewed: false,
          },
          {
            title: "RESTful API Development",
            icon_class: "udi udi-video",
            content_summary: "50min",
            can_be_previewed: false,
          },
          {
            title: "Database Integration with MongoDB",
            icon_class: "udi udi-video",
            content_summary: "55min",
            can_be_previewed: false,
          },
          {
            title: "Authentication and Authorization",
            icon_class: "udi udi-article",
            content_summary: "30min",
            can_be_previewed: false,
          },
          {
            title: "Backend Assignment: Build an API",
            icon_class: "udi udi-assignment",
            content_summary: "150min",
            can_be_previewed: false,
          },
        ],
      },
      {
        title: "Final Project: Full-Stack Application",
        lecture_count: 6,
        content_length: "6h 30min",
        items: [
          {
            title: "Project Planning and Architecture",
            icon_class: "udi udi-video",
            content_summary: "30min",
            can_be_previewed: false,
          },
          {
            title: "Frontend Development",
            icon_class: "udi udi-video",
            content_summary: "60min",
            can_be_previewed: false,
          },
          {
            title: "Backend Development",
            icon_class: "udi udi-video",
            content_summary: "60min",
            can_be_previewed: false,
          },
          {
            title: "Database Design and Implementation",
            icon_class: "udi udi-article",
            content_summary: "25min",
            can_be_previewed: false,
          },
          {
            title: "Testing and Deployment",
            icon_class: "udi udi-video",
            content_summary: "40min",
            can_be_previewed: false,
          },
          {
            title: "Final Project Submission",
            icon_class: "udi udi-assignment",
            content_summary: "120min",
            can_be_previewed: false,
          },
        ],
      },
    ],
    num_of_published_lectures: 42,
    estimated_content_length_text: "21h 15m",
  },
};

const dummyInstructorData = {
  id: "instructor_001",
  name: "Dr. Angela Yu",
  title: "Developer and Lead Instructor",
  profileImage: "/images/instructors/angela-yu.jpg",
  rating: 4.7,
  totalReviews: 992516,
  totalStudents: 3245003,
  totalCourses: 7,
  bio: {
    short:
      "I'm Angela, I'm a developer with a passion for teaching. I'm the lead instructor at the London App Brewery, London's leading Programming Bootcamp.",
    full: `I'm Angela, I'm a developer with a passion for teaching. I'm the **lead instructor** at the London App Brewery, London's leading **Programming Bootcamp**.

I've helped hundreds of thousands of students learn to code and change their lives by becoming a developer. I've been invited by companies such as Twitter, Facebook and Google to teach their employees.

My first foray into programming was when I was just 12 years old, wanting to build my own Space Invader game. Since then, I've made **hundreds of websites, apps and games**. But most importantly, I realised that my **greatest passion is teaching**.

I spend most of my time researching how to make **learning to code fun** and make **hard concepts easy to understand**. I apply everything I discover into my bootcamp courses. In my courses, you'll find lots of **geeky humour** but also lots of **explanations and animations** to make sure everything is easy to understand.

I'll be there for you every step of the way.`,
    isExpanded: false,
  },
  socialLinks: {
    website: "https://www.appbrewery.co",
    twitter: "https://twitter.com/yu_angela",
    linkedin: "https://linkedin.com/in/angela-yu",
    github: "https://github.com/angela-yu",
  },
  expertise: [
    "Web Development",
    "Mobile App Development",
    "Python Programming",
    "JavaScript",
    "React",
    "Node.js",
    "Flutter",
    "Machine Learning",
  ],
  achievements: [
    "Lead Instructor at London App Brewery",
    "Taught at Twitter, Facebook, and Google",
    "Over 3.2 million students worldwide",
    "Creator of 7 bestselling courses",
    "Featured in TechCrunch and Forbes",
  ],
  teachingStyle: {
    approach: "Hands-on, project-based learning",
    focus: "Making complex concepts easy to understand",
    features: [
      "Geeky humour",
      "Clear explanations",
      "Animations",
      "Real-world projects",
    ],
  },
};

const dummyReviews = {
  overallRating: 4.7,
  totalRatings: 448887,
  ratingBreakdown: {
    5: 320000,
    4: 80000,
    3: 30000,
    2: 10000,
    1: 8887,
  },
  reviews: [
    {
      id: "1",
      reviewerName: "Gytis B.",
      reviewerInitials: "GB",
      rating: 4.5,
      timePosted: "3 weeks ago",
      reviewText:
        "I initially gave this course 5 stars, but after completing it, I found it a bit outdated, especially with React and some javascript concepts. However, the fundamentals are still solid and Angela is an excellent instructor. The course structure is well-organized and the projects are practical. I would recommend it for beginners, but intermediate developers might find some sections too basic.",
      isExpanded: false,
      helpfulCount: 45,
      notHelpfulCount: 3,
      isHelpful: null,
    },
    {
      id: "2",
      reviewerName: "Daniel H.",
      reviewerInitials: "DH",
      rating: 5,
      timePosted: "a month ago",
      reviewText:
        "This bootcamp has been an incredible experience! The bite-sized structure makes it easy to follow along, and Angela's clear and engaging teaching style keeps you motivated throughout. The projects are practical and build upon each other perfectly. I went from knowing nothing about web development to building full-stack applications. Highly recommended for anyone starting their coding journey!",
      isExpanded: false,
      helpfulCount: 128,
      notHelpfulCount: 2,
      isHelpful: null,
    },
    {
      id: "3",
      reviewerName: "Md Nurul H.",
      reviewerInitials: "MH",
      rating: 5,
      timePosted: "2 months ago",
      reviewText:
        "Angela Yu's Full Stack Web Development course is absolutely fantastic! It's well-structured, beginner-friendly, and hands-on. The course covers everything from HTML/CSS basics to advanced React concepts. The instructor explains complex topics in simple terms, and the practical projects help reinforce learning. I've already built several websites and feel confident in my web development skills.",
      isExpanded: false,
      helpfulCount: 89,
      notHelpfulCount: 1,
      isHelpful: null,
    },
    {
      id: "4",
      reviewerName: "Srianshu P.",
      reviewerInitials: "SP",
      rating: 5,
      timePosted: "1 month ago",
      reviewText:
        "My experience with Angela Yu Ma'am was quite good. She is not only a good tutor but also an awesome human being who has a good sense of humour. The course content is comprehensive and up-to-date. The way she explains concepts makes complex topics easy to understand. The projects are real-world applicable and the community support is excellent.",
      isExpanded: false,
      helpfulCount: 67,
      notHelpfulCount: 0,
      isHelpful: null,
    },
    {
      id: "5",
      reviewerName: "Alex K.",
      reviewerInitials: "AK",
      rating: 4,
      timePosted: "3 weeks ago",
      reviewText:
        "Great course overall! The content is well-organized and Angela is a fantastic instructor. I particularly enjoyed the hands-on projects and the way she breaks down complex concepts. The only minor issue is that some of the newer JavaScript features could be covered more extensively, but the fundamentals are solid.",
      isExpanded: false,
      helpfulCount: 34,
      notHelpfulCount: 2,
      isHelpful: null,
    },
    {
      id: "6",
      reviewerName: "Sarah M.",
      reviewerInitials: "SM",
      rating: 5,
      timePosted: "2 weeks ago",
      reviewText:
        "This course exceeded my expectations! Angela's teaching style is engaging and the course structure is perfect for beginners. I love how each section builds upon the previous one. The projects are practical and helped me build a strong portfolio. The community is supportive and Angela is always responsive to questions. Worth every penny!",
      isExpanded: false,
      helpfulCount: 56,
      notHelpfulCount: 1,
      isHelpful: null,
    },
    {
      id: "7",
      reviewerName: "Michael R.",
      reviewerInitials: "MR",
      rating: 4.5,
      timePosted: "1 week ago",
      reviewText:
        "Excellent course for web development beginners! The instructor explains everything clearly and the hands-on approach really helps with retention. The projects are well-designed and provide good practice. I would have given 5 stars, but some sections could use more recent updates. Still, highly recommended!",
      isExpanded: false,
      helpfulCount: 23,
      notHelpfulCount: 1,
      isHelpful: null,
    },
    {
      id: "8",
      reviewerName: "Emma L.",
      reviewerInitials: "EL",
      rating: 5,
      timePosted: "4 days ago",
      reviewText:
        "This is hands down the best web development course I've taken! Angela's teaching method is brilliant - she makes complex topics accessible and fun. The course is comprehensive, covering everything from basics to advanced concepts. The projects are practical and helped me land my first web development job. Thank you, Angela!",
      isExpanded: false,
      helpfulCount: 78,
      notHelpfulCount: 0,
      isHelpful: null,
    },
  ],
};

const dummyRecommendedCourses = [
  {
    id: "1",
    title: "The Web Developer Bootcamp 2025",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    badge: "Premium",
    totalHours: "74",
    lastUpdated: "6/2025",
    rating: 4.6,
    totalRatings: 944436,
    currentPrice: 499,
    originalPrice: 3229,
    isWishlisted: false,
  },
  {
    id: "2",
    title: "Complete web development course",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/567828_67d0.jpg",
    badge: "Premium",
    totalHours: "86.5",
    lastUpdated: "8/2025",
    rating: 4.6,
    totalRatings: 51388,
    currentPrice: 479,
    originalPrice: 3089,
    isWishlisted: false,
  },
  {
    id: "3",
    title: "100 Hours Web Development Bootcamp - Build 23 React Projects",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    badge: "Premium",
    totalHours: "128.5",
    lastUpdated: "7/2025",
    rating: 4.7,
    totalRatings: 6640,
    currentPrice: 499,
    originalPrice: 2129,
    isWishlisted: false,
  },
  {
    id: "4",
    title: "Complete 2025 Python Bootcamp: Learn Python from Scratch",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/567828_67d0.jpg",
    badge: "Bestseller",
    totalHours: "12.5",
    lastUpdated: "8/2025",
    rating: 4.6,
    totalRatings: 19879,
    currentPrice: 499,
    originalPrice: 2129,
    isWishlisted: false,
  },
  {
    id: "5",
    title: "Python Mega Course: Build 20 Real-World Apps & AI Assistants",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    badge: "Premium",
    totalHours: "51",
    lastUpdated: "8/2025",
    rating: 4.6,
    totalRatings: 347530,
    currentPrice: 699,
    originalPrice: 4469,
    isWishlisted: false,
  },
  {
    id: "6",
    title: "100 Days of Code: The Complete Python Pro Bootcamp",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/567828_67d0.jpg",
    badge: "Bestseller",
    totalHours: "56.5",
    lastUpdated: "8/2025",
    rating: 4.7,
    totalRatings: 1634892,
    currentPrice: 499,
    originalPrice: 3219,
    isWishlisted: false,
  },
];

// ==================== API ENDPOINTS ====================

// Get course basic data (for sidebar and header)
router.get("/:id/basic", async (req, res) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    res.json({
      success: true,
      data: dummyCourseData,
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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    res.json({
      success: true,
      data: dummyIndividualCourseData,
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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    res.json({
      success: true,
      data: dummyIncentivesData,
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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 250));

    res.json({
      success: true,
      data: dummyInstructorData,
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
    const { page = 1, limit = 8, rating } = req.query;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredReviews = dummyReviews.reviews;

    // Filter by rating if provided
    if (rating) {
      filteredReviews = filteredReviews.filter(
        (review) => review.rating >= parseInt(rating)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        ...dummyReviews,
        reviews: paginatedReviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredReviews.length / limit),
          totalReviews: filteredReviews.length,
          hasMore: endIndex < filteredReviews.length,
        },
      },
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
    const { limit = 6 } = req.query;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const limitedCourses = dummyRecommendedCourses.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: limitedCourses,
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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    const relatedTopics = [
      "Web Development",
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
      "Full Stack Development",
      "Frontend Development",
      "Backend Development",
    ];

    res.json({
      success: true,
      data: relatedTopics,
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

// Get course pricing and offers
router.get("/:id/pricing", async (req, res) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    const pricing = {
      currentPrice: 479,
      originalPrice: 3109,
      discount: 85,
      subscriptionPrice: 500,
      timeLeft: "1 day left at this price!",
      currency: "INR",
      isOnSale: true,
      saleEndsAt: "2025-02-02T00:00:00Z",
    };

    res.json({
      success: true,
      data: pricing,
    });
  } catch (error) {
    console.error("Get course pricing error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ==================== INSTRUCTOR ENDPOINTS ====================

// Get instructor's courses
router.get("/instructor/my-courses", authenticate, async (req, res) => {
  try {
    console.log(req.user.role);
    // Only instructors can access their courses
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can access this endpoint",
      });
    }

    // Fetch real courses from database for the authenticated user
    console.log(req.user.userId);

    const courses = await Course.find({
      instructorId: req.user.userId,
    }).select(
      "title subtitle thumbnailUrl price status createdAt viewCount enrollmentCount"
    );

    console.log(courses);
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
      instructorId: req.user.userId,
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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const courseData = {
      ...dummyCourseData,
      ...dummyIndividualCourseData,
      curriculum: dummyIncentivesData,
      instructor: dummyInstructorData,
      reviews: dummyReviews,
      recommendedCourses: dummyRecommendedCourses,
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

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Mock course list
    const courses = Array.from({ length: 20 }, (_, i) => ({
      id: `course_${i + 1}`,
      title: `Course ${i + 1}: Web Development Masterclass`,
      headline: `Learn web development from scratch with this comprehensive course`,
      instructor: { name: "Dr. Angela Yu" },
      rating: 4.5 + Math.random() * 0.5,
      totalRatings: Math.floor(Math.random() * 100000) + 1000,
      totalStudents: Math.floor(Math.random() * 1000000) + 10000,
      price: Math.floor(Math.random() * 500) + 200,
      originalPrice: Math.floor(Math.random() * 2000) + 1000,
      thumbnail: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
      category: "Development",
      level: "All Levels",
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
    }));

    // Apply filters
    let filteredCourses = courses;

    if (category) {
      filteredCourses = filteredCourses.filter(
        (course) => course.category === category
      );
    }

    if (level) {
      filteredCourses = filteredCourses.filter(
        (course) => course.level === level
      );
    }

    if (search) {
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.headline.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    switch (sort) {
      case "rating":
        filteredCourses.sort((a, b) => b.rating - a.rating);
        break;
      case "students":
        filteredCourses.sort((a, b) => b.totalStudents - a.totalStudents);
        break;
      case "price":
        filteredCourses.sort((a, b) => a.price - b.price);
        break;
      case "oldest":
        filteredCourses.sort((a, b) => a.createdAt - b.createdAt);
        break;
      default: // newest
        filteredCourses.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        courses: paginatedCourses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredCourses.length / limit),
          totalCourses: filteredCourses.length,
          hasMore: endIndex < filteredCourses.length,
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

// Create a new course (instructor only)
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      title,
      headline,
      description,
      category,
      subcategory,
      price,
      originalPrice,
      thumbnail,
    } = req.body;

    // Only instructors can create courses
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can create courses",
      });
    }

    // Simulate course creation
    const newCourse = {
      id: `course_${Date.now()}`,
      title,
      headline,
      instructor: req.user.userId,
      category,
      subcategory,
      price,
      originalPrice,
      thumbnail,
      status: "draft",
      createdAt: new Date(),
    };

    //add this into database
    const course = await Course.create(newCourse);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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

// Get instructor's courses
// router.get("/instructor/my-courses", authenticate, async (req, res) => {
//   try {
//     // Allow all authenticated users to access their courses
//     // Removed instructor-only restriction

//     // Simulate instructor courses
//     // const instructorCourses = [
//     //   {
//     //     id: "course_1",
//     //     title: "The Complete Full-Stack Web Development Bootcamp",
//     //     status: "published",
//     //     totalStudents: 1486975,
//     //     rating: 4.7,
//     //     totalRatings: 448887,
//     //     price: 479,
//     //     thumbnail:
//     //       "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
//     //     createdAt: "2023-01-15",
//     //   },
//     //   {
//     //     id: "course_2",
//     //     title: "Python for Beginners",
//     //     status: "draft",
//     //     totalStudents: 0,
//     //     rating: 0,
//     //     totalRatings: 0,
//     //     price: 299,
//     //     thumbnail: "https://img-c.udemycdn.com/course/750x422/567828_67d0.jpg",
//     //     createdAt: "2025-01-20",
//     //   },
//     // ];

//     res.json({
//       success: true,
//       data: instructorCourses,
//     });
//   } catch (error) {
//     console.error("Get instructor courses error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });

module.exports = router;
