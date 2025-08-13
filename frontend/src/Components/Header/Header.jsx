import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./header.css";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import Badge from "@mui/material/Badge";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { auth, fetchUserData } from "../../Redux/login/action";
import { addToCart } from "../../Redux/cart/action";
import ProfileDropdown from "./ProfileDropdown";

export const Header = () => {
  const { cart } = useSelector((store) => store.cart);
  const { user } = useSelector((store) => store.auth);
  const { wishlist } = useSelector((store) => store.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check token and user state on every render
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If token exists but no user data, fetch user data
    if (token && !user.user) {
      dispatch(fetchUserData(token));
      console.log("user", user);
    }

    // If on login page and already logged in, redirect to home
    if (token && window.location.pathname === "/login") {
      navigate("/");
      return;
    }

    // Fetch cart data if user exists
    if (token && user?.user?._id) {
      axios
        .get(`https://udemy-vr4p.onrender.com/cart/${user.user._id}`)
        .then(({ data }) => {
          console.log(data);
          dispatch(addToCart(data.length));
        })
        .catch((err) => {
          console.log("Cart fetch error:", err);
        });
    }
  }, [dispatch, navigate, user.user]);

  // Check if user is an instructor
  const isInstructor = user?.user?.userType === "instructor";
  const location = useLocation();
  const isInstructorPage = location.pathname.startsWith("/instructor");
  const isLoggedIn = !!user?.user;
  const [showStudentTooltip, setShowStudentTooltip] = useState(false);

  return (
    <>
      <header>
        <div className="topnavbar">
          <Link className="udemylink" to={"/"}>
            <img
              className="udemylogo"
              src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg"
              alt=""
            />
          </Link>
          {!isInstructorPage && (
            <nav>
              <button>
                <span className="nav-span">Explore</span>
              </button>
            </nav>
          )}
          {!isInstructorPage && (
            <div className="searchbar">
              <button>
                <SearchIcon />
              </button>
              <input type="text" name="" placeholder="Search for anything" />
            </div>
          )}

          <div className="right-side-nav">
            {!isInstructorPage && (
              <div>
                <Link className="linkstyle" to={"#"}>
                  <span className="nav-span">Udemy Business</span>
                </Link>
              </div>
            )}
            <div>
              {isInstructor ? (
                !isInstructorPage ? (
                  <Link className="linkstyle" to="/instructor/courses">
                    <span className="nav-span">Instructor</span>
                  </Link>
                ) : (
                  <div
                    className="student-button-container"
                    onMouseEnter={() => setShowStudentTooltip(true)}
                    onMouseLeave={() => setShowStudentTooltip(false)}
                  >
                    <button
                      className="student-button"
                      onClick={() => navigate("/")}
                    >
                      Student
                    </button>
                    {showStudentTooltip && (
                      <div className="tooltip">
                        Switch to the student view here - get back to the
                        courses you're taking.
                      </div>
                    )}
                  </div>
                )
              ) : (
                <Link className="linkstyle" to="/teach">
                  <span className="nav-span">Teach on Udemy</span>
                </Link>
              )}
            </div>
            {isLoggedIn && !isInstructorPage ? (
              <div>
                <Link className="linkstyle" to={"#"}>
                  <span className="nav-span">My learning</span>
                </Link>
              </div>
            ) : null}
            {isLoggedIn && !isInstructorPage ? (
              <div>
                <Link to={"/wishlist"}>
                  <button className="wishlist-icon">
                    <Badge
                      color="secondary"
                      badgeContent={wishlist?.length || 0}
                    >
                      <FavoriteBorderOutlinedIcon></FavoriteBorderOutlinedIcon>
                    </Badge>
                  </button>
                </Link>
              </div>
            ) : null}
            {!isInstructorPage && (
              <div>
                <Link to={"/cart"}>
                  <button className="cart">
                    <Badge color="secondary" badgeContent={cart}>
                      <ShoppingCartOutlinedIcon></ShoppingCartOutlinedIcon>
                    </Badge>
                  </button>
                </Link>
              </div>
            )}
            {isLoggedIn ? (
              <div>
                <Link to={"#"}>
                  <button className="notification-btn">
                    <Badge color="secondary" badgeContent={0}>
                      <NotificationsNoneOutlinedIcon></NotificationsNoneOutlinedIcon>
                    </Badge>
                  </button>
                </Link>
              </div>
            ) : null}
            {isLoggedIn ? (
              <div className="profile-icon">
                <ProfileDropdown user={user.user} />
              </div>
            ) : (
              <>
                <div>
                  <Link to={"/login"}>
                    <button className="login">Log in</button>
                  </Link>
                </div>
                <div>
                  <Link to={"/signup"}>
                    <button className="signup">Sign up</button>
                  </Link>
                </div>
                <div>
                  <Link to={"#"}>
                    <button className="lang">
                      <LanguageIcon />
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
