import React, { useState } from "react";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  const courses = [
    {
      id: 1,
      title: "Data structures and algorithms",
      status: "DRAFT",
      visibility: "Public",
      progress: 85,
      isCompleted: false,
    },
    {
      id: 2,
      title: "Data structures and algorithms",
      status: "DRAFT",
      visibility: "Public",
      progress: 0,
      isCompleted: false,
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 m-0">Courses</h1>
        <div className="flex items-center gap-4">
          {/* Search Container */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search your courses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-70 h-12 px-4 pr-12 border-2 border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:border-purple-600 transition-colors duration-200"
            />
            <div className="absolute right-4 text-gray-400">
              <svg
                className="w-5 h-5"
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
              className="h-12 px-4 pr-10 border-2 border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:border-purple-600 cursor-pointer appearance-none"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
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
          <button className="h-12 px-6 bg-purple-600 text-white font-medium rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200">
            New Course
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-full border border-purple-600 hover:bg-purple-100 transition-colors duration-200">
          All (2)
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-full border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
          Published (0)
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-full border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
          Draft (2)
        </button>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              {/* Course Info */}
              <div className="flex items-center space-x-4">
                {/* Course Image Placeholder */}
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
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

                {/* Course Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {course.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                      {course.status}
                    </span>
                    <span>{course.visibility}</span>
                  </div>
                </div>
              </div>

              {/* Progress and Actions */}
              <div className="flex items-center space-x-6">
                {/* Progress */}
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {course.progress}%
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                    <svg
                      className="w-5 h-5"
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
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                    <svg
                      className="w-5 h-5"
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

      {/* Empty State (if no courses) */}
      {courses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Jump Into Course Creation
          </h3>
          <p className="text-gray-600 mb-6">
            Create an engaging course with the help of our marketplace insights.
          </p>
          <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded hover:bg-purple-700 transition-colors duration-200">
            Create Your Course
          </button>
        </div>
      )}
    </div>
  );
};

export default Courses;
