import React from "react";
import StarIcon from "@mui/icons-material/Star";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const CourseHeader = ({ course }) => {
  return (
    <div className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-gray-300 mb-6">{course.headline}</p>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-bold">
                  {course.rating || 4.5}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <span className="text-purple-300">
                  ({course.total_ratings?.toLocaleString() || "0"} ratings)
                </span>
              </div>
              <div className="text-gray-300">
                {course.total_students?.toLocaleString() || "0"} students
              </div>
            </div>
          </div>

          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={course.thumbnailUrl || course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/320x180/6366f1/ffffff?text=${encodeURIComponent(
                      course.title.substring(0, 20)
                    )}`;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <button className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all">
                    <PlayCircleOutlineIcon className="text-gray-800 text-4xl" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    FREE
                  </div>
                </div>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium mb-3">
                  Enroll for Free
                </button>
                <div className="text-center text-sm text-gray-600">
                  30-Day Money-Back Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
