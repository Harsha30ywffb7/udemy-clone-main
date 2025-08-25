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

const Landin = () => {
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
          <PersonalizedExplore />
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

// Personalized explore section based on user behavior
const PersonalizedExplore = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [exploreBlocks, setExploreBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateExploreBlocks = async () => {
      setLoading(true);
      const blocks = [];

      // Check if user is logged in
      if (user?.user) {
        // Block 1: Continue learning (if enrolled in courses)
        if (user.user.enrolledCourses && user.user.enrolledCourses.length > 0) {
          blocks.push({
            title: "Continue learning",
            description: "Jump back into your recent topics.",
            action: () => navigate("/learning"),
          });
        }

        // Block 2: Based on enrolled categories
        if (
          user.user.enrolledCategories &&
          user.user.enrolledCategories.length > 0
        ) {
          const recentCategory =
            user.user.enrolledCategories[
              user.user.enrolledCategories.length - 1
            ];
          blocks.push({
            title: `More ${recentCategory} courses`,
            description: "Explore similar topics to what you're learning.",
            action: () =>
              navigate(
                `/search?category=${encodeURIComponent(recentCategory)}`
              ),
          });
        }

        // Block 3: Based on wishlist
        if (user.user.wishlist && user.user.wishlist.length > 0) {
          blocks.push({
            title: "From your wishlist",
            description: "Courses you've saved for later.",
            action: () => navigate("/wishlist"),
          });
        }
      }

      // If not enough personalized blocks, add trending/popular
      if (blocks.length < 3) {
        try {
          const response = await courseService.getAllCourses({ limit: 1 });
          if (response.success && response.data?.courses?.length > 0) {
            const popularCategory = response.data.courses[0].category;
            blocks.push({
              title: `Popular in ${popularCategory}`,
              description: "Trending courses in this category.",
              action: () =>
                navigate(
                  `/search?category=${encodeURIComponent(popularCategory)}`
                ),
            });
          }
        } catch (error) {
          console.error("Error fetching popular courses:", error);
        }
      }

      // Fallback blocks if still not enough
      while (blocks.length < 3) {
        const fallbackBlocks = [
          {
            title: "Trending this week",
            description: "Most popular courses right now.",
            action: () => navigate("/search?q=trending"),
          },
          {
            title: "New courses",
            description: "Fresh content just added.",
            action: () => navigate("/search?q=new"),
          },
          {
            title: "Free courses",
            description: "Learn without spending a dime.",
            action: () => navigate("/search?q=free"),
          },
        ];

        const fallbackIndex = blocks.length;
        if (fallbackIndex < fallbackBlocks.length) {
          blocks.push(fallbackBlocks[fallbackIndex]);
        }
      }

      setExploreBlocks(blocks);
      setLoading(false);
    };

    generateExploreBlocks();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="w-full max-w-[1340px] mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-4">Explore for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-md border border-gray-200 bg-white"
            >
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={16} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1340px] mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-4">Explore for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exploreBlocks.map((block, index) => (
          <button
            key={`${block.title}-${index}`}
            onClick={block.action}
            className="text-left p-4 rounded-md border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-lg font-semibold">{block.title}</div>
            <div className="text-sm text-gray-600 mt-1">
              {block.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Landin;
