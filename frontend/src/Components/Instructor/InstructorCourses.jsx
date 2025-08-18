import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DescriptionIcon from "@mui/icons-material/Description";
import BarChartIcon from "@mui/icons-material/BarChart";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ProfileDropdown from "../Header/ProfileDropdown";
import DraftCourses from "./DraftCourses";
import { fetchUserData } from "../../Redux/login/action";
import axios from "axios";

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

  const avatarText = userData.fullName
    ? userData.fullName.charAt(0).toUpperCase()
    : "U";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user?.user) {
      dispatch(fetchUserData(token));
    }
  }, [dispatch, user]);

  const sidebarItems = [
    {
      icon: <BuildOutlinedIcon />,
      label: "Courses",
      active: true,
      onClick: () => navigate("/instructor/courses"),
    },
    {
      icon: <PlayArrowIcon />,
      label: "Performance",
      active: false,
      onClick: () => {},
    },
    {
      icon: <DescriptionIcon />,
      label: "Tools",
      active: false,
      onClick: () => {},
    },
    {
      icon: <BarChartIcon />,
      label: "Resources",
      active: false,
      onClick: () => {},
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarExpanded ? "w-50" : "w-18"
        } bg-gray-900 flex flex-col items-center py-4 transition-all duration-300 overflow-hidden fixed h-screen z-50 ${
          sidebarExpanded ? "items-start px-3" : ""
        }`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Sidebar Header */}
        <div
          className={`mb-6 flex w-full ${
            sidebarExpanded ? "justify-start" : "justify-center"
          }`}
        >
          <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            U
          </div>
          {sidebarExpanded && (
            <div className="ml-3 flex flex-col">
              <span className="text-white text-sm font-medium">Udemy</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 w-full">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`w-full flex items-center p-3 mb-2 rounded-lg transition-colors duration-200 ${
                item.active
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              } ${sidebarExpanded ? "justify-start" : "justify-center"}`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarExpanded && (
                <span className="ml-3 text-sm">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Help Button */}
        <button
          className={`w-full flex items-center p-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${
            sidebarExpanded ? "justify-start" : "justify-center"
          }`}
        >
          <HelpOutlineIcon />
          {sidebarExpanded && <span className="ml-3 text-sm">Help</span>}
        </button>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          sidebarExpanded ? "ml-50" : "ml-18"
        } transition-all duration-300`}
      >
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Instructor</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Student Mode Button */}
            <div className="relative">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
                onClick={() => navigate("/")}
                onMouseEnter={() => setShowStudentTooltip(true)}
                onMouseLeave={() => setShowStudentTooltip(false)}
              >
                Student
              </button>
              {showStudentTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded text-xs whitespace-nowrap z-50 mt-2">
                  Switch to the student view here - get back to the courses
                  you're taking.
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center">
              <ProfileDropdown user={userData} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, {userData.fullName}!
                  </h2>
                  <p className="text-gray-600">
                    Ready to create your next course?
                  </p>
                </div>
                <button
                  onClick={() => navigate("/course/create")}
                  className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Create New Course
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PlayArrowIcon className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChartIcon className="text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DescriptionIcon className="text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Courses
              </h3>
            </div>
            <div className="p-6">
              <DraftCourses />
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tips to get started
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Plan your course
                  </h4>
                  <p className="text-sm text-gray-600">
                    Define learning objectives and structure your content
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Create quality content
                  </h4>
                  <p className="text-sm text-gray-600">
                    Record high-quality videos and engaging materials
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorCourses;
