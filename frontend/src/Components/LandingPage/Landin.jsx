import "../Header/header.css";
import banner from "../../assets/middle.jpg";
import StudentContainer from "./StudentContainer";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import HeroCarousel from "./HeroCarousel";
import Advertisement from "./Advertisement";
import FeaturedTopics from "./FeaturedTopics";
import TopCategories from "./TopCategories";
import CourseSuggestions from "./CourseSuggestions";

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
  const loading = useRef(true);

  // Check if user is logged in based on Redux state and token existence
  const isLoggedIn = !!(
    user?.user &&
    user?.token &&
    localStorage.getItem("token")
  );

  console.log("LandingPage - isLoggedIn:", isLoggedIn, "user:", user);

  // Simulate loading completion
  useEffect(() => {
    loading.current = false;
  }, []);

  // Log authentication state changes for debugging
  useEffect(() => {
    console.log("LandingPage - Auth state changed:", {
      hasUser: !!user?.user,
      hasToken: !!user?.token,
      hasLocalStorageToken: !!localStorage.getItem("token"),
      isLoggedIn,
    });
  }, [user, isLoggedIn]);

  return (
    <>
      <div>
        {isLoggedIn ? (
          <HeroCarousel />
        ) : (
          <div className="midbanner">
            <div className="bannercard">
              <div>
                <h1>Dream big</h1>
                <p>
                  Learn the skills to reach your goals with courses taught by
                  real-world experts.
                </p>
              </div>
            </div>
            <div className="bannerdiv">
              <img src={banner} alt="some" />
            </div>
          </div>
        )}
      </div>

      {loading.current ? (
        <>
          <SkeltonLoading />
          <SkeltonLoading />
        </>
      ) : (
        <>
          <CourseSuggestions />
          <StudentContainer />

          <TopCategories />

          <FeaturedTopics />
          <Advertisement />
        </>
      )}
    </>
  );
};

const SkeltonLoading = () => {
  return (
    <>
      <div className="skelton">
        <Skeleton className="line" variant="text" animation="wave" />
        <div className="midskel">
          <Skeleton
            className="rectangel"
            variant="rectangular"
            width={50}
            height={50}
          />
          <div>
            <Part />
          </div>
        </div>
      </div>
    </>
  );
};

const Part = () => {
  return (
    <>
      <Skeleton className="line" variant="text" animation="wave" />
      <Skeleton className="line" variant="text" animation="wave" />
      <Skeleton className="line" variant="text" animation="wave" />
      <Skeleton className="line" variant="text" animation="wave" />
    </>
  );
};
