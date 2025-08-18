import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { courseService, courseUtils } from "../../services/courseService";

// Material-UI Icons
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LanguageIcon from "@mui/icons-material/Language";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ArticleIcon from "@mui/icons-material/Article";
import DownloadIcon from "@mui/icons-material/Download";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShareIcon from "@mui/icons-material/Share";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Dummy data for the course
const dummyCourseData = {
  title: "The Complete Full-Stack Web Development Bootcamp",
  headline:
    "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps.",
  visible_instructors: [{ title: "Dr. Angela Yu" }],
  rating: 4.7,
  total_ratings: 448887,
  total_students: 1486975,
  // Pricing removed - free application
  thumbnail: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
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

// Dummy data for recommended courses (Students also bought)
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
    // Pricing removed - free application
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
    isWishlisted: false,
  },
];

// Dummy data for course reviews
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
      isHelpful: null, // null = not voted, true = helpful, false = not helpful
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

// Dummy data for instructor information
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

const CoursePage = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(dummyCourseData);
  const [courseDetails, setCourseDetails] = useState(dummyIndividualCourseData);
  const [loading, setLoading] = useState(false); // Set to false to use dummy data
  const [showSliderMenu, setShowSliderMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showAllCaptionLang, setShowAllCaptionLang] = useState(false);
  const [showDescription, setShowDescription] = useState({});
  const [isSectionExpanded, setIsSectionExpanded] = useState([0]);
  const [visibleSectionsCount, setVisibleSectionsCount] = useState(10);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  const [expandSections, setExpandSections] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false);
  const [curriculumData, setCurriculumData] = useState(dummyIncentivesData);
  const [recommendedCourses, setRecommendedCourses] = useState(
    dummyRecommendedCourses
  );
  const [showMoreRecommended, setShowMoreRecommended] = useState(false);
  const [reviewsData, setReviewsData] = useState(dummyReviews);
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [instructorData, setInstructorData] = useState(dummyInstructorData);
  const [relatedTopics, setRelatedTopics] = useState([
    "Web Development",
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
  ]);

  const contentRef = useRef(null);
  const objectivesListRef = useRef(null);
  const sliderMenuRef = useRef(null);
  const courseBodyRef = useRef(null);

  useEffect(() => {
    // Fetch course data using the new API service
    fetchCourseData();
    fetchCourseDetails();
    fetchCourseCurriculum();
    fetchCourseInstructor();
    fetchCourseReviews();
    fetchRecommendedCourses();
    fetchRelatedTopics();
  }, [id]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", calculatePositions);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculatePositions);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      checkHeight();
    }, 1000);
  }, [courseData]);

  // API calls using the new course service
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourseBasic(id);
      if (response.success) {
        setCourseData(response.data);
      }
    } catch (error) {
      console.error("Error fetching course basic data:", error);
      // Fallback to dummy data
      setCourseData(dummyCourseData);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await courseService.getCourseDetailed(id);
      if (response.success) {
        setCourseDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching course detailed data:", error);
      // Fallback to dummy data
      setCourseDetails(dummyIndividualCourseData);
    }
  };

  const fetchCourseCurriculum = async () => {
    try {
      const response = await courseService.getCourseCurriculum(id);
      if (response.success) {
        setCurriculumData(response.data);
      }
    } catch (error) {
      console.error("Error fetching course curriculum:", error);
      // Fallback to dummy data
      setCurriculumData(dummyIncentivesData);
    }
  };

  const fetchCourseInstructor = async () => {
    try {
      const response = await courseService.getCourseInstructor(id);
      if (response.success) {
        setInstructorData(response.data);
      }
    } catch (error) {
      console.error("Error fetching course instructor:", error);
      // Fallback to dummy data
      setInstructorData(dummyInstructorData);
    }
  };

  const fetchCourseReviews = async () => {
    try {
      const response = await courseService.getCourseReviews(id, {
        page: 1,
        limit: 8,
      });
      if (response.success) {
        setReviewsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching course reviews:", error);
      // Fallback to dummy data
      setReviewsData(dummyReviews);
    }
  };

  const fetchRecommendedCourses = async () => {
    try {
      const response = await courseService.getRecommendedCourses(id, 6);
      if (response.success) {
        setRecommendedCourses(response.data);
      }
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
      // Fallback to dummy data
      setRecommendedCourses(dummyRecommendedCourses);
    }
  };

  const fetchRelatedTopics = async () => {
    try {
      const response = await courseService.getRelatedTopics(id);
      if (response.success) {
        setRelatedTopics(response.data);
      }
    } catch (error) {
      console.error("Error fetching related topics:", error);
      // Fallback to dummy data
      setRelatedTopics([
        "Web Development",
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB",
      ]);
    }
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const contentTop = contentRef.current.getBoundingClientRect().top;
      setShowSliderMenu(contentTop <= 0);
    }

    if (showSliderMenu) {
      calculatePositions();
    }
  };

  const checkHeight = () => {
    if (objectivesListRef.current) {
      const objectivesDiv = objectivesListRef.current;
      const contentHeight = objectivesDiv.scrollHeight;
      const viewportHeight = 600;

      if (contentHeight > 300) {
        setShowButton(contentHeight > viewportHeight * 0.25);
      }
    }
  };

  const calculatePositions = () => {
    if (sliderMenuRef.current && courseBodyRef.current) {
      const sliderMenuRect = sliderMenuRef.current.getBoundingClientRect();
      const courseBodyRect = courseBodyRef.current.getBoundingClientRect();
    }
  };

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDescription = (index, subIndex) => {
    setShowDescription((prev) => {
      const newState = { ...prev };
      if (!newState[index]) {
        newState[index] = [];
      }

      const isVisible = newState[index].includes(subIndex);

      if (isVisible) {
        newState[index] = newState[index].filter((item) => item !== subIndex);
      } else {
        newState[index].push(subIndex);
      }

      return newState;
    });
  };

  const handleCourseSection = (index) => {
    setIsSectionExpanded((prev) => {
      const isSectionVisible = prev.includes(index);
      if (isSectionVisible) {
        return prev.filter((item) => item !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const showMoreSections = () => {
    setVisibleSectionsCount(
      curriculumData?.curriculum_data?.sections?.length || 0
    );
    setShowMoreBtn(false);
  };

  const toggleSections = () => {
    if (expandSections) {
      setIsSectionExpanded([]);
      setShowMoreBtn(false);
    } else {
      const sections = curriculumData?.curriculum_data?.sections || [];
      setIsSectionExpanded(sections.map((_, index) => index));
      showMoreSections();
    }
    setExpandSections(!expandSections);
  };

  const watchMoreLanguages = () => {
    setShowAllCaptionLang(true);
  };

  const formattedDate = () => {
    if (!courseDetails.last_update_date) return "";
    const date = new Date(courseDetails.last_update_date);
    return `${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${date.getFullYear()}`;
  };

  const formattedDuration = (contentLength) => {
    if (!contentLength) return "0min";

    // If it's already a number (seconds), convert it
    if (!isNaN(contentLength)) {
      const hours = Math.floor(contentLength / 3600);
      const minutes = Math.floor((contentLength % 3600) / 60);
      return hours === 0 ? `${minutes}min` : `${hours}h ${minutes}min`;
    }

    // If it's a string like "45min", "2h 15min", "21h 15m", etc.
    const timeStr = contentLength.toString().toLowerCase();

    // Handle "Xmin" format
    if (timeStr.includes("min") && !timeStr.includes("h")) {
      const minutes = timeStr.replace("min", "").trim();
      return `${minutes}min`;
    }

    // Handle "Xh Ymin" format
    if (timeStr.includes("h") && timeStr.includes("min")) {
      const parts = timeStr.split("h");
      const hours = parts[0].trim();
      const minutes = parts[1].replace("min", "").trim();
      return `${hours}h ${minutes}min`;
    }

    // Handle "Xh Ym" format (like "21h 15m")
    if (
      timeStr.includes("h") &&
      timeStr.includes("m") &&
      !timeStr.includes("min")
    ) {
      const parts = timeStr.split("h");
      const hours = parts[0].trim();
      const minutes = parts[1].replace("m", "").trim();
      return `${hours}h ${minutes}min`;
    }

    // Handle "Xh" format
    if (
      timeStr.includes("h") &&
      !timeStr.includes("min") &&
      !timeStr.includes("m")
    ) {
      const hours = timeStr.replace("h", "").trim();
      return `${hours}h`;
    }

    // Handle "Xm" format (just minutes)
    if (
      timeStr.includes("m") &&
      !timeStr.includes("h") &&
      !timeStr.includes("min")
    ) {
      const minutes = timeStr.replace("m", "").trim();
      return `${minutes}min`;
    }

    // Default fallback
    return contentLength;
  };

  // Custom Video Icon Component
  const VideoIcon = () => (
    <svg
      aria-hidden="true"
      focusable="false"
      className="ud-icon ud-icon-xsmall ud-icon-color-neutral ud-block-list-item-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
    >
      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
    </svg>
  );

  // Custom Article Icon Component
  const ArticleIcon = () => (
    <svg
      aria-hidden="true"
      focusable="false"
      className="ud-icon ud-icon-xsmall ud-icon-color-neutral ud-block-list-item-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
    >
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  );

  const displayIcon = (iconClass) => {
    const courseIcons = [
      { icon_class: "udi udi-article", icon: ArticleIcon },
      { icon_class: "udi udi-video", icon: VideoIcon },
      { icon_class: "udi udi-video-mashup", icon: VideoIcon },
      { icon_class: "udi udi-quiz", icon: ArticleIcon },
      { icon_class: "udi udi-coding-exercise", icon: ArticleIcon },
      { icon_class: "udi udi-practice-test", icon: ArticleIcon },
      { icon_class: "udi udi-assignment", icon: ArticleIcon },
      { icon_class: "udi udi-file", icon: ArticleIcon },
      { icon_class: "udi udi-audio", icon: PlayCircleOutlineIcon },
      { icon_class: "udi udi-presentation", icon: ArticleIcon },
    ];

    const match = courseIcons.find(
      (iconItem) => iconItem.icon_class === iconClass
    );
    return match || { icon: null };
  };

  const visibleSections =
    curriculumData?.curriculum_data?.sections?.slice(0, visibleSectionsCount) ||
    [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading course...</div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">Course not found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      {/* Slider Menu */}
      {showSliderMenu && (
        <div
          ref={sliderMenuRef}
          className="sticky top-0 bg-gray-900 px-4 py-2 z-50 border-b border-gray-700"
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <p className="text-white font-bold text-sm">{courseData.title}</p>
              {courseDetails?.bestseller_badge_content?.badge_text && (
                <div className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-xs font-bold">
                  {courseDetails.bestseller_badge_content.badge_text}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        ref={contentRef}
        className="flex max-w-5xl mx-auto px-10 py-8 relative"
      >
        {/* Left Content */}
        <div className="flex-1 mr-8 max-w-4xl">
          {/* Course Categories */}
          <div className="flex items-center text-sm font-semibold text-purple-300 mb-6">
            <a href="#" className="hover:text-purple-200">
              {courseDetails.primary_category?.title}
            </a>
            <KeyboardArrowRightIcon className="text-white text-xs mx-1" />
            <a href="#" className="hover:text-purple-200">
              {courseDetails.primary_subcategory?.title}
            </a>
            <KeyboardArrowRightIcon className="text-white text-xs mx-1" />
            <a href="#" className="hover:text-purple-200">
              {courseDetails?.context_info?.label?.title}
            </a>
          </div>

          {/* Course Title */}
          <h1 className="text-2xl font-bold text-white mb-4">
            {courseData.title}
          </h1>

          {/* Course Headline */}
          <h3 className="text-[1.1rem] font-300 text-white mb-4">
            {courseData.headline}
          </h3>

          {/* Bestseller Badge or Rating */}
          {courseDetails?.bestseller_badge_content?.badge_text ? (
            <div className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-xs font-bold w-fit mb-4">
              {courseDetails.bestseller_badge_content.badge_text}
            </div>
          ) : (
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-white font-bold">4.5</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="text-yellow-400 text-lg" />
                ))}
              </div>
              <span className="text-purple-300 text-sm">(17,379 ratings)</span>
            </div>
          )}

          {/* Instructor */}
          <h4 className="text-white mb-4">
            Created by{" "}
            <a
              href="#"
              className="text-purple-300 underline hover:text-purple-200"
            >
              {courseData.visible_instructors
                ?.map((user) => user.title)
                .join(", ")}
            </a>
          </h4>

          {/* Course Details */}
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center space-x-1">
              <AccessTimeIcon className="text-sm" />
              <span>Last updated {formattedDate()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LanguageIcon className="text-sm" />
              <span>English</span>
            </div>
            {!showAllCaptionLang &&
              courseDetails?.caption_languages?.length > 0 && (
                <div className="flex items-center space-x-1">
                  <ClosedCaptionIcon className="text-sm" />
                  <span>
                    {courseDetails.caption_languages.slice(0, 2).join(", ")}
                  </span>
                  {courseDetails.caption_languages.length > 2 && (
                    <button
                      onClick={watchMoreLanguages}
                      className="text-purple-300 underline hover:text-purple-200 flex items-center space-x-1"
                    >
                      <span>
                        , {courseDetails.caption_languages.length - 2} more
                      </span>
                      <KeyboardArrowDownIcon className="text-xs" />
                    </button>
                  )}
                </div>
              )}
          </div>

          {/* All Caption Languages */}
          {showAllCaptionLang && (
            <div className="flex items-center space-x-1 text-sm text-gray-400 mb-4">
              <ClosedCaptionIcon className="text-sm" />
              <span>{courseDetails?.caption_languages?.join(", ")}</span>
              <button
                onClick={watchMoreLanguages}
                className="text-purple-300 underline hover:text-purple-200 flex items-center space-x-1"
              >
                <span>Show less</span>
                <KeyboardArrowUpIcon className="text-xs" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Course Body */}
      <div ref={courseBodyRef} className="bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-10 py-8">
          <div className="flex gap-8">
            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl">
              {/* What You'll Learn Section */}
              <div className="border border-gray-200 rounded mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900">
                    What you'll learn
                  </h2>
                  <ul
                    ref={objectivesListRef}
                    className={`grid grid-cols-2 gap-x-8 gap-y-3 ${
                      !isExpanded ? "max-h-48 overflow-hidden" : ""
                    }`}
                  >
                    {courseDetails?.what_you_will_learn_data?.items?.map(
                      (item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircleIcon className="text-gray-900 text-sm flex-shrink-0 mt-0.5" />
                          <span className="text-sm font-light text-gray-700 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      )
                    )}
                  </ul>

                  {showButton && (
                    <button
                      onClick={toggleContent}
                      className="text-purple-600 font-bold text-sm mt-4 flex items-center space-x-1 hover:bg-purple-50 px-2 py-1 rounded"
                    >
                      <span>{isExpanded ? "Show Less" : "Show More"}</span>
                      {isExpanded ? (
                        <KeyboardArrowUpIcon className="text-xs" />
                      ) : (
                        <KeyboardArrowDownIcon className="text-xs" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Explore Related Topics */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Explore related topics
                </h2>
                <div className="flex flex-wrap gap-2">
                  {relatedTopics.map((topic, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 border border-gray-300 rounded text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Course content
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    {curriculumData?.curriculum_data?.sections?.length || 0}{" "}
                    sections •
                    {curriculumData?.curriculum_data
                      ?.num_of_published_lectures || 0}{" "}
                    lectures •
                    {formattedDuration(
                      curriculumData?.curriculum_data
                        ?.estimated_content_length_text || ""
                    )}{" "}
                    total length
                  </p>
                  <button
                    onClick={toggleSections}
                    className="text-purple-600 font-bold text-sm hover:bg-purple-50 px-2 py-1 rounded"
                  >
                    {expandSections
                      ? "Collapse all sections"
                      : "Expand all sections"}
                  </button>
                </div>

                {/* Course Sections */}
                <div className="border border-gray-200 rounded">
                  {visibleSections.map((section, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <div className="bg-gray-50 p-4">
                        <button
                          onClick={() => handleCourseSection(index)}
                          className="w-full flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            {isSectionExpanded.includes(index) ? (
                              <KeyboardArrowUpIcon className="text-gray-600 text-sm" />
                            ) : (
                              <KeyboardArrowDownIcon className="text-gray-600 text-sm" />
                            )}
                            <span className="font-bold">{section.title}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {section.lecture_count}{" "}
                            {section.lecture_count === 1
                              ? "lecture"
                              : "lectures"}{" "}
                            •{formattedDuration(section.content_length || "")}
                          </span>
                        </button>
                      </div>

                      {isSectionExpanded.includes(index) && (
                        <div className="p-4 bg-white">
                          {section.items?.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center space-x-3 py-2"
                            >
                              {(() => {
                                const IconComponent = displayIcon(
                                  item.icon_class
                                )?.icon;
                                return IconComponent ? (
                                  <IconComponent className="text-gray-600 text-sm" />
                                ) : null;
                              })()}
                              <span className="flex-1 text-sm">
                                {item.title}
                              </span>
                              {item.can_be_previewed && (
                                <button className="text-purple-600 text-sm underline hover:text-purple-700">
                                  Preview
                                </button>
                              )}
                              <span className="text-sm text-gray-500">
                                {item.content_summary}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {curriculumData?.curriculum_data?.sections?.length > 10 &&
                  showMoreBtn && (
                    <button
                      onClick={showMoreSections}
                      className="w-full mt-4 py-2 border border-purple-600 text-purple-600 font-bold text-sm hover:bg-purple-50 rounded"
                    >
                      {curriculumData.curriculum_data.sections.length - 10} more
                      sections
                    </button>
                  )}
              </div>

              {/* Requirements Section */}
              <div className="border border-gray-200 rounded mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {courseDetails?.requirements_data?.items?.map(
                      (item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm font-light text-gray-700 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Description Section */}
              <div className="border border-gray-200 rounded mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900">
                    Description
                  </h2>
                  <div
                    className={`${
                      !isDescriptionExpanded ? "max-h-96 overflow-hidden" : ""
                    }`}
                  >
                    <div className="text-sm font-light text-gray-700 leading-relaxed whitespace-pre-line">
                      {courseDetails?.description_data?.content}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="text-purple-600 font-bold text-sm mt-4 flex items-center space-x-1 hover:bg-purple-50 px-2 py-1 rounded"
                  >
                    <span>
                      {isDescriptionExpanded ? "Show Less" : "Show More"}
                    </span>
                    {isDescriptionExpanded ? (
                      <KeyboardArrowUpIcon className="text-xs" />
                    ) : (
                      <KeyboardArrowDownIcon className="text-xs" />
                    )}
                  </button>
                </div>
              </div>

              {/* Students also bought Section */}
              <div className="bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto px-10 py-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Students also bought
                  </h2>

                  {/* Horizontal Course Cards */}
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {(showMoreRecommended
                      ? recommendedCourses
                      : recommendedCourses.slice(0, 6)
                    ).map((course) => (
                      <div key={course.id} className="flex-shrink-0 w-60">
                        <div className="bg-white border border-gray-200 rounded p-3">
                          {/* Course Thumbnail */}
                          <div className="w-full h-28 bg-gray-200 rounded mb-2 flex-shrink-0">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "block";
                              }}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs hidden">
                              {course.title.split(" ").slice(0, 2).join(" ")}
                            </div>
                          </div>

                          {/* Course Title */}
                          <h3 className="text-xs font-bold text-gray-900 mb-1.5 line-clamp-2 leading-tight">
                            {course.title}
                          </h3>

                          {/* Badge */}
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span
                              className={`px-1 py-0.5 text-xs font-bold rounded ${
                                course.badge === "Premium"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {course.badge}
                            </span>
                          </div>

                          {/* Rating and Students */}
                          <div className="flex items-center space-x-1 mb-1.5">
                            <span className="text-xs font-bold text-gray-900">
                              {course.rating}
                            </span>
                            <div className="flex">
                              <StarIcon className="text-xs text-yellow-400" />
                            </div>
                            <span className="text-xs text-gray-600">
                              {course.totalRatings.toLocaleString()}
                            </span>
                          </div>

                          {/* Wishlist Button */}
                          <div className="flex items-center justify-end">
                            <button className="flex-shrink-0 p-0.5 text-gray-400 hover:text-red-500 transition-colors">
                              <svg
                                className="w-3.5 h-3.5"
                                fill={
                                  course.isWishlisted ? "currentColor" : "none"
                                }
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Show More Button */}
                  {recommendedCourses.length > 6 && (
                    <div className="text-center mt-4">
                      <button
                        onClick={() =>
                          setShowMoreRecommended(!showMoreRecommended)
                        }
                        className="px-4 py-2 bg-purple-600 text-white font-bold text-sm rounded hover:bg-purple-700 transition-colors"
                      >
                        {showMoreRecommended ? "Show less" : "Show more"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - CourseSidebar component */}
            <div className="w-80 flex-shrink-0">
              {/* Removed CourseSidebar component */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
