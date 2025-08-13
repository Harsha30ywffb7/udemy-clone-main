// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { AllRoutes } from "./Components/Routes/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const App = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = user?.user;

    // If user is logged in and is an instructor
    if (userData && userData.userType === "instructor") {
      // If on home page, redirect to instructor area
      // But only if they're not explicitly accessing student mode
      if (location.pathname === "/" && !sessionStorage.getItem("studentMode")) {
        if (userData.isOnboarded) {
          navigate("/instructor/courses");
        } else {
          navigate("/instructor/onboard");
        }
      }
    }
  }, [user, navigate, location.pathname]);

  return (
    <div className="main-cont">
      <AllRoutes />
    </div>
  );
};
