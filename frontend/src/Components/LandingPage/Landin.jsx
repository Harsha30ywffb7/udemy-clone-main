import banner from "../../assets/middle.jpg";
import StudentContainer from "./StudentContainer";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import HeroCarousel from "./HeroCarousel";
import Advertisement from "./Advertisement";
import FeaturedTopics from "./FeaturedTopics";
import TopCategories from "./TopCategories";
import CourseSuggestions from "./CourseSuggestions";
import { courseService } from "../../services/courseService";
import { useNavigate } from "react-router-dom";

export const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ffffff !important",
    padding: "0 !important",
    color: "#1c1d1f !important",
    boxShadow:
      "0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08) !important",
    border: "1px solid #e5e5e5 !important",
    borderRadius: "4px !important",
    fontSize: "14px !important",
    fontWeight: "400 !important",
    lineHeight: "1.4 !important",
    maxWidth: "320px !important",
    zIndex: "9999 !important",
    position: "relative !important",
  },
  [`& .${tooltipClasses.popper}`]: {
    zIndex: "9999 !important",
  },
}));

export const Landin = () => {
  return (
    <>
      <LandingPage />
    </>
  );
};

const LandingPage = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in based on Redux state and token existence
  const isLoggedIn = !!(
    user?.user &&
    user?.token &&
    localStorage.getItem("token")
  );

  // Simulate loading completion - now properly triggers re-render
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Small delay to show loading state briefly

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div>
        {/* Categories Section - Added below header */}
        <CategoriesSection />
        {isLoggedIn ? (
          <HeroCarousel />
        ) : (
          <div className="relative">
            {/* Banner Card - positioned absolutely over the image */}
            <div className="absolute left-40 top-32 max-w-md bg-white shadow-lg p-6 z-10 rounded-lg">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  Dream big
                </h1>
                <p className="text-base text-gray-700 font-normal leading-relaxed">
                  Learn the skills to reach your goals with courses taught by
                  real-world experts.
                </p>
              </div>
            </div>
            {/* Banner Image */}
            <div className="flex justify-center">
              <img
                src={banner}
                alt="Learning banner"
                className="w-full max-w-[1340px] h-[400px] object-cover mx-auto"
              />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <>
          <SkeltonLoading />
          <SkeltonLoading />
        </>
      ) : (
        <>
          <CourseSuggestions />
          <StudentContainer />
          <FeaturedTopics />
          <div className="mb-16">
            <TopCategories />
          </div>
          <Advertisement />
        </>
      )}
    </>
  );
};

// New Categories Section Component (fetches from API)
const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await courseService.getHomeCategories();

        if (!mounted) return;

        const categoriesData = response?.data || [];

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          setCategories([]);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
        setCategories([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []); // ✅ Empty dependency array - only run once

  // Don't render if loading or error
  if (loading) return null;
  if (error) return null;
  if (!categories || categories.length === 0) return null;

  return (
    <div className="bg-white border-b border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.slug || cat.title || cat.id}
                className="flex-shrink-0 text-[0.8rem] font-[300] text-gray-700 hover:text-purple-600 transition-colors duration-200 whitespace-nowrap px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => {
                  navigate(`/search?category=${encodeURIComponent(cat.title)}`);
                }}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeltonLoading = () => {
  return (
    <div className="w-full max-w-[1340px] mx-auto px-6 py-8">
      <div className="mb-8">
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="text" width="60%" height={20} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton variant="rectangular" width="100%" height={200} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton variant="text" width="40%" height={16} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
