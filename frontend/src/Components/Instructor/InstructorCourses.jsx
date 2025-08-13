import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DescriptionIcon from "@mui/icons-material/Description";
import BarChartIcon from "@mui/icons-material/BarChart";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Badge from "@mui/material/Badge";
import ProfileDropdown from "../Header/ProfileDropdown";
import DraftCourses from "./DraftCourses";
import { fetchUserData } from "../../Redux/login/action";
import axios from "axios";
import "./InstructorCourses.css";

const InstructorCourses = () => {
  const [showStudentTooltip, setShowStudentTooltip] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux store
  const { user } = useSelector((store) => store.auth);
  const userData = user?.user || {
    fullName: "User",
    email: "user@example.com",
  };

  // Check token and user state on every render
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If token exists but no user data, fetch user data
    if (token && !user.user) {
      dispatch(fetchUserData(token));
    }
  }, [dispatch, user.user]);

  // Fetch instructor courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user.user?._id) return;

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/courses/instructor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user.user?._id]);

  const resources = [
    {
      id: "test-video",
      title: "Test Video",
      description: "Send us a sample video and get expert feedback.",
      icon: "/images/instructorCourse/relevance-1.webp",
    },
    {
      id: "community",
      title: "Instructor Community",
      description:
        "Connect with experienced instructors. Ask questions, browse discussions, and more.",
      icon: "/images/instructorCourse/communication.webp",
    },
    {
      id: "teaching-center",
      title: "Teaching Center",
      description: "Learn about best practices for teaching on Udemy.",
      icon: "/images/instructorCourse/instructor.webp",
    },
    {
      id: "marketplace-insights",
      title: "Marketplace Insights",
      description:
        "Validate your course topic by exploring our marketplace supply and demand.",
      icon: "/images/instructorCourse/impact-measurement.webp",
    },
    {
      id: "help-support",
      title: "Help and Support",
      description: "Browse our Help Center or contact our support team.",
      icon: "/images/instructorCourse/soft-skills.webp",
    },
  ];

  const sidebarItems = [
    { id: "courses", icon: <PlayArrowIcon />, label: "Courses" },
    { id: "curriculum", icon: <DescriptionIcon />, label: "Curriculum" },
    { id: "performance", icon: <BarChartIcon />, label: "Performance" },
    { id: "tools", icon: <BuildOutlinedIcon />, label: "Tools" },
    { id: "resources", icon: <HelpOutlineIcon />, label: "Resources" },
  ];

  return (
    <div className="instructor-dashboard">
      {/* Left Sidebar */}
      <div
        className={`sidebar ${sidebarExpanded ? "expanded" : ""}`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="sidebar-header">
          <div className="udemy-logo">U</div>
        </div>
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${item.id === "courses" ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarExpanded && (
                <span className="nav-label">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Instructor Courses</h1>
          </div>
          <div className="header-right">
            <div
              className="student-button-container"
              onMouseEnter={() => setShowStudentTooltip(true)}
              onMouseLeave={() => setShowStudentTooltip(false)}
            >
              <button className="student-button" onClick={() => navigate("/")}>
                Student
              </button>
              {showStudentTooltip && (
                <div className="tooltip">
                  Switch to the student view here - get back to the courses
                  you're taking.
                </div>
              )}
            </div>
            <div className="header-icons">
              <button className="notification-btn">
                <Badge color="secondary" badgeContent={0}>
                  <NotificationsNoneOutlinedIcon />
                </Badge>
              </button>
              <ProfileDropdown user={userData} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content">
          {courses.length === 0 ? (
            /* Show Create Course section only when no courses exist */
            <>
              {/* Jump Into Course Creation */}
              <div className="jump-into-creation">
                <div className="jump-content">
                  <h2>Jump Into Course Creation</h2>
                  <button
                    className="create-course-btn"
                    onClick={() => navigate("/course/create")}
                  >
                    Create Your Course
                  </button>
                </div>
              </div>

              {/* Resources Section */}
              <div className="resources-section">
                <p className="resources-intro">
                  Based on your experience, we think these resources will be
                  helpful.
                </p>

                <div className="resource-cards">
                  <div className="resource-card">
                    <div className="card-image">
                      <img
                        src="/images/instructorOnboard/engaging-course-1.webp"
                        alt="Create an Engaging Course"
                      />
                    </div>
                    <div className="card-content">
                      <h3>Create an Engaging Course</h3>
                      <p>
                        Whether you've been teaching for years or are teaching
                        for the first time, you can make an engaging course.
                        We've compiled resources and best practices to help you
                        get to the next level, no matter where you're starting.
                      </p>
                      <a href="#" className="get-started-link">
                        Get Started
                      </a>
                    </div>
                  </div>

                  <div className="merge-cards">
                    <div className="resource-card">
                      <div className="card-image">
                        <img
                          src="/images/instructorOnboard/video-creation.webp"
                          alt="Get Started with Video"
                        />
                      </div>
                      <div className="card-content">
                        <h3>Get Started with Video</h3>
                        <p>
                          Quality video lectures can set your course apart. Use
                          our resources to learn the basics.
                        </p>
                        <a href="#" className="get-started-link">
                          Get Started
                        </a>
                      </div>
                    </div>

                    <div className="resource-card">
                      <div className="card-image">
                        <img
                          src="/images/instructorOnboard/build-audience.webp"
                          alt="Build Your Audience"
                        />
                      </div>
                      <div className="card-content">
                        <h3>Build Your Audience</h3>
                        <p>
                          Set your course up for success by building your
                          audience.
                        </p>
                        <a href="#" className="get-started-link">
                          Get Started
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="challenge-card">
                    <div className="card-image">
                      <img
                        src="/images/instructorOnboard/engaging-course-1.webp"
                        alt="New Instructor Challenge"
                      />
                    </div>
                    <div className="card-content">
                      <h3>Join the New Instructor Challenge!</h3>
                      <p>
                        Get exclusive tips and resources designed to help you
                        launch your first course faster! Eligible instructors
                        who publish their first course on time will receive a
                        special bonus to celebrate. Start today!
                      </p>
                      <a href="#" className="get-started-link">
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Show Courses UI when courses exist */
            <>
              {/* Courses Header */}
              <div className="courses-header">
                <div className="courses-title">
                  <h1>Courses</h1>
                </div>
                <div className="courses-actions">
                  <div className="search-filter-bar">
                    <div className="search-container">
                      <input
                        type="text"
                        placeholder="Search your courses"
                        className="search-input"
                      />
                      <button className="search-btn">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M15.5 15.5L11.5 11.5M13.1667 7.33333C13.1667 10.555 10.555 13.1667 7.33333 13.1667C4.11167 13.1667 1.5 10.555 1.5 7.33333C1.5 4.11167 4.11167 1.5 7.33333 1.5C10.555 1.5 13.1667 4.11167 13.1667 7.33333Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="filter-container">
                      <button className="filter-btn">
                        <span>Newest</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M3 4.5L6 7.5L9 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    className="new-course-btn"
                    onClick={() => navigate("/course/create")}
                  >
                    New course
                  </button>
                </div>
              </div>

              {/* Promotional Banner */}
              <div className="promotional-banner">
                <div className="banner-content">
                  <div className="banner-tag">New</div>
                  <div className="banner-text">
                    We upgraded practice tests so you can upgrade yours. With
                    our creation improvements, new question types, and
                    generative AI features, maximize your practice test's
                    certification prep potential.
                  </div>
                  <div className="banner-actions">
                    <button className="learn-more-btn">Learn more</button>
                    <button className="dismiss-btn">Dismiss</button>
                  </div>
                </div>
              </div>

              {/* Draft Courses */}
              <DraftCourses courses={courses} />

              {/* Resources Section */}
              <div className="resources-section">
                <p className="resources-intro">
                  Based on your experience, we think these resources will be
                  helpful.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourses;
