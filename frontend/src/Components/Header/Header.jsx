import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Badge from "@mui/material/Badge";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../Redux/login/action";
import ProfileDropdown from "./ProfileDropdown";

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

  return (
    <header className="max-w-full">
      <div className="flex items-center justify-between px-6 h-[72px] bg-white flex-nowrap">
        <Link to="/" className="flex-shrink-0 pr-3 text-purple-700">
          <img
            className="w-[91px] h-[34px]"
            src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg"
            alt="Udemy Logo"
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
          <div className="flex items-center flex-4 max-w-[800px] min-w-[400px] mx-4 border border-gray-900 rounded-full px-3 bg-white h-12">
            <button className="bg-transparent text-gray-900 border-none text-xs mr-2">
              <SearchIcon />
            </button>
            <input
              type="text"
              placeholder="Search for anything"
              className="bg-transparent border-none w-full h-full text-sm focus:outline-none"
            />
          </div>
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

          {/* Show Teach on Udemy for non-logged in users */}
          {!isLoggedIn && (
            <Link
              to="/teach"
              className="text-[13px] font-light text-gray-800 px-3 py-2 rounded hover:bg-purple-100"
            >
              Teach on Udemy
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
