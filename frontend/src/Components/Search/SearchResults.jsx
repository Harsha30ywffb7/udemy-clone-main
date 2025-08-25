import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { courseService } from "../../services/courseService";
import CourseCard from "../ProdCard/CourseCard";

const useQuery = () => new URLSearchParams(useLocation().search);

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
          res?.data?.courses || res?.courses || res?.data?.data?.courses || [];
        setItems(courses);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [query, category]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">
        {category
          ? `Category: ${category}`
          : query
          ? `Searched for: ${query}`
          : "Courses"}
      </h1>
      {query && (
        <p className="text-sm text-gray-600 mb-4">Showing related courses</p>
      )}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {items.map((c) => (
            <CourseCard key={c.id || c._id} course={c} />
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
