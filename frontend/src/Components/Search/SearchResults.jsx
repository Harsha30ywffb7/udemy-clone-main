import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { courseService } from "../../services/courseService";

const useQuery = () => new URLSearchParams(useLocation().search);
console.log("came to this page");

const Card = ({ course }) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <div className="font-semibold text-gray-900 line-clamp-2">
          {course.title}
        </div>
        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
          {course.headline || course.desc}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {course.totalLectures || 0} lectures •{" "}
          {course.duration ? `${Math.round(course.duration / 60)} mins` : ""}
        </div>
      </div>
    </div>
  );
};

const SearchResults = () => {
  const q = useQuery();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const query = q.get("q");
  const category = q.get("category");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = {};
        if (query) params.search = query;
        if (category) params.category = category;
        const res = await courseService.getAllCourses(params);
        // Handle various response shapes gracefully
        const courses =
          res?.data?.courses || // when service returns axios body
          res?.courses || // if service already unwraps to data
          res?.data?.data?.courses || // defensive for nested data
          [];
        setItems(courses);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [query, category]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">
        {category
          ? `Category: ${category}`
          : query
          ? `Results for "${query}"`
          : "Courses"}
      </h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((c) => (
            <button key={c.id} onClick={() => navigate(`/course/${c.id}`)}>
              <Card course={c} />
            </button>
          ))}
          {items.length === 0 && (
            <div className="text-gray-600">No courses found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
