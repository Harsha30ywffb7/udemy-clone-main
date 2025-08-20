import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Badge from "@mui/material/Badge";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../Redux/login/action";
import ProfileDropdown from "./ProfileDropdown";
import { courseService } from "../../services/courseService";

export const Header = () => {
  const { user } = useSelector((store) => store.auth);
  const { wishlist } = useSelector((store) => store.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Only fetch user data if we have a token but no user data
    if (token && !user.user && !user.loading) {
      dispatch(fetchUserData(token));
    }

    // Redirect from login page if already logged in
    if (token && user.user && window.location.pathname === "/login") {
      navigate("/");
    }
  }, [dispatch, navigate, user.user, user.loading]);

  console.log("user in header", user.user);

  const isInstructorPage = location.pathname.startsWith("/instructor");
  const isLoggedIn = !!user?.user;
  const isInstructor = user?.user?.role === "instructor";

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsCacheRef = useRef(new Map());
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  const onChangeQuery = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const q = value.trim();
      if (!q) {
        // Show last cached results if any
        const cached = suggestionsCacheRef.current.get("") || [];
        setSuggestions(cached);
        return;
      }
      try {
        // serve from cache if present
        if (suggestionsCacheRef.current.has(q)) {
          setSuggestions(suggestionsCacheRef.current.get(q));
          setOpen(true);
          return;
        }
        const res = await courseService.getSearchSuggestions(q, 8);
        const data = res?.data || [];
        setSuggestions(data);
        suggestionsCacheRef.current.set(q, data);
        if (!suggestionsCacheRef.current.has("")) {
          suggestionsCacheRef.current.set("", data);
        }
        setOpen(true);
      } catch (err) {
        setSuggestions([]);
      }
    }, 400);
  };

  const onFocus = () => {
    if (suggestions.length > 0) setOpen(true);
  };

  const onBlur = () => {
    setTimeout(() => setOpen(false), 150);
  };

  const goToCourse = (id) => {
    navigate(`/course/${id}`);
    setOpen(false);
  };

  const goToSearchResults = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length === 0) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <header className="max-w-full">
      <div className="flex items-center justify-between px-6 h-[72px] bg-white flex-nowrap">
        <Link to="/" className="flex-shrink-0 pr-3 text-purple-700">
          <img
            src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg"
            alt="Vidhyara Logo"
            className="h-8"
          />
        </Link>
        {!isInstructorPage && (
          <nav>
            <button className="text-[13px] font-light text-gray-800 px-3 py-2 rounded hover:bg-purple-100">
              Explore
            </button>
          </nav>
        )}
        {!isInstructorPage && (
          <form
            onSubmit={goToSearchResults}
            className="relative flex items-center flex-4 max-w-[800px] min-w-[400px] mx-4 border border-gray-900 rounded-full px-3 bg-white h-12"
          >
            <button className="bg-transparent text-gray-900 border-none text-xs mr-2">
              <SearchIcon />
            </button>
            <input
              type="text"
              placeholder="Search for anything"
              className="bg-transparent border-none w-full h-full text-sm focus:outline-none"
              value={query}
              onChange={onChangeQuery}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            {open && (
              <div className="absolute left-0 top-12 w-full bg-white border border-gray-200 shadow-xl rounded-md z-50 p-3">
                <div className="text-xs font-semibold text-gray-500 px-2 pb-2">
                  Popular on Vidhyara
                </div>

                <ul>
                  {suggestions.map((s) => (
                    <li key={s.id}>
                      <button
                        className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded text-left"
                        onMouseDown={() => goToCourse(s.id)}
                      >
                        <span className="text-gray-500">
                          <SearchIcon fontSize="small" />
                        </span>
                        <div className="flex-1">
                          <div className="text-sm text-gray-900 line-clamp-1">
                            {s.title}
                          </div>
                          {s.subtitle && (
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {s.subtitle}
                            </div>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                  {suggestions.length === 0 && (
                    <li className="px-2 py-2 text-sm text-gray-500">
                      No results
                    </li>
                  )}
                </ul>
              </div>
            )}
          </form>
        )}

        <div className="flex items-center gap-2">
          {/* Show Teach button only for instructors */}
          {isLoggedIn && isInstructor && !isInstructorPage && (
            <Link
              to="/instructor/courses"
              className="text-[13px] font-light text-gray-800 px-3 py-2 rounded hover:bg-purple-100"
            >
              Teach
            </Link>
          )}

          {/* Show Teach on Vidhyara for non-logged in users */}
          {!user?.user && (
            <Link
              to="/instructor-signup"
              className="text-[#1c1d1f] hover:text-[#5624d0] text-sm font-medium"
            >
              Teach on Vidhyara
            </Link>
          )}

          {isLoggedIn && !isInstructorPage && (
            <Link
              to="#"
              className="text-[13px] font-light text-gray-800 px-3 py-2 rounded hover:bg-purple-100"
            >
              My learning
            </Link>
          )}

          {isLoggedIn && !isInstructorPage && (
            <Link to="/wishlist">
              <button className="bg-transparent border-none text-gray-500 p-2 rounded hover:bg-purple-100">
                <Badge color="secondary" badgeContent={wishlist?.length || 0}>
                  <FavoriteBorderOutlinedIcon />
                </Badge>
              </button>
            </Link>
          )}

          {isLoggedIn ? (
            <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold dropdown-container">
              <ProfileDropdown user={user.user} />
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="px-4 py-2 border border-gray-900 font-semibold text-sm hover:bg-gray-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-2 border border-gray-900 bg-gray-900 text-white font-semibold text-sm">
                  Sign up
                </button>
              </Link>
              <Link to="#">
                <button className="px-3 py-2 border border-gray-900">
                  <LanguageIcon />
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
