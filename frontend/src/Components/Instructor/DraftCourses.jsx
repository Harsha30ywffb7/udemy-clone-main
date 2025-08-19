import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { instructorService } from "../../services/instructorService";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [activeFilter, setActiveFilter] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch instructor courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your courses");
          return;
        }

        const result = await instructorService.getCourses();
        if (result.success) {
          setCourses(result.data);
          setError(null);
        } else {
          setError(result.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter and search functionality
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Apply status filter
    if (activeFilter === "Published") {
      filtered = filtered.filter((course) => course.status === "PUBLISHED");
    } else if (activeFilter === "Draft") {
      filtered = filtered.filter((course) => course.status === "DRAFT");
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "Oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "A-Z":
          return a.title.localeCompare(b.title);
        case "Z-A":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchTerm, sortBy, activeFilter]);

  const getFilterCounts = () => {
    const all = courses.length;
    const published = courses.filter((c) => c.status === "PUBLISHED").length;
    const draft = courses.filter((c) => c.status === "DRAFT").length;
    return { all, published, draft };
  };

  const { all, published, draft } = getFilterCounts();

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen font-sans">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Courses</h2>
          <div className="flex items-center gap-3">
            <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"
            ></div>
          ))}
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-lg border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-2 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex space-x-1">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen font-sans">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Courses
          </h3>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 m-0">Courses</h2>
        <div className="flex items-center gap-3">
          {/* Search Container */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search your courses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 h-10 px-3 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:border-purple-500 transition-colors duration-200"
            />
            <div className="absolute right-3 text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 pr-8 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:border-purple-500 cursor-pointer appearance-none"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* New Course Button */}
          <button
            onClick={() => navigate("/course/create")}
            className="h-10 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 text-sm"
          >
            New Course
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveFilter("All")}
          className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200 ${
            activeFilter === "All"
              ? "text-purple-600 bg-purple-50 border-purple-600"
              : "text-gray-600 bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          All ({all})
        </button>
        <button
          onClick={() => setActiveFilter("Published")}
          className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200 ${
            activeFilter === "Published"
              ? "text-purple-600 bg-purple-50 border-purple-600"
              : "text-gray-600 bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          Published ({published})
        </button>
        <button
          onClick={() => setActiveFilter("Draft")}
          className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200 ${
            activeFilter === "Draft"
              ? "text-purple-600 bg-purple-50 border-purple-600"
              : "text-gray-600 bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          Draft ({draft})
        </button>
      </div>

      {/* Course List */}
      <div className="space-y-3">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-gray-50 rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              {/* Course Info */}
              <div className="flex items-center space-x-4">
                {/* Course Image */}
                <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <svg
                    className="w-7 h-7 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ display: course.thumbnail ? "none" : "block" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* Course Details */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {course.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        course.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {course.status}
                    </span>
                    <span>{course.visibility}</span>
                    {course.totalStudents > 0 && (
                      <span>{course.totalStudents} students</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress and Actions */}
              <div className="flex items-center space-x-6">
                {/* Progress */}
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        course.progress === 100
                          ? "bg-green-500"
                          : course.progress > 70
                          ? "bg-blue-500"
                          : course.progress > 40
                          ? "bg-yellow-500"
                          : "bg-red-400"
                      }`}
                      style={{ width: `${Math.max(course.progress, 5)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 min-w-[3rem]">
                    {course.progress}%
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-1">
                  <button
                    onClick={() =>
                      navigate(`/instructor/course/edit/${course.id}`)
                    }
                    className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors duration-200"
                    title="Edit course"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors duration-200"
                    title="More options"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? "No courses found" : "Jump Into Course Creation"}
          </h3>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {searchTerm
              ? `No courses match "${searchTerm}". Try a different search term.`
              : "Create an engaging course with the help of our marketplace insights."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate("/course/create")}
              className="px-5 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm"
            >
              Create Your Course
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;
