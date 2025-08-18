import { Route, Routes, Navigate } from "react-router-dom";
import { Header } from "../Header/Header";
import { Landin } from "../LandingPage/Landin";
import Login from "../Login_Signup/Login";
import Signup from "../Login_Signup/Signup";
import Wishlist from "../Wishlist/Wishlist";
import Instructor from "../Login_Signup/Instructor";
import InstructorOnboarding from "../Instructor/InstructorOnboarding";
import InstructorCourses from "../Instructor/InstructorCourses";
import CourseCreation from "../Instructor/CourseCreation";
import CourseEditPage from "../Instructor/CourseEditPage";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import CoursePage from "../Course/CoursePage";
import ProfilePage from "../Login_Signup/ProfilePage";

// Protected Route for Instructor Onboarding
const InstructorOnboardingRoute = () => {
  const { user } = useSelector((store) => store.auth);
  const userData = user?.user;

  // If not logged in, redirect to login
  if (!userData) {
    return <Navigate to="/login" />;
  }

  // Only instructors can access onboarding
  if (userData.role !== "instructor") {
    return <Navigate to="/" />;
  }

  // Show onboarding
  return <InstructorOnboarding />;
};

// Protected Route for Instructor Courses
const InstructorCoursesRoute = () => {
  const { user } = useSelector((store) => store.auth);
  const userData = user?.user;

  // If not logged in, redirect to login
  if (!userData) {
    return <Navigate to="/login" />;
  }

  // Only instructors can access instructor courses
  if (userData.role !== "instructor") {
    return <Navigate to="/" />;
  }

  // Show courses
  return <InstructorCourses />;
};

const InstructorRoutes = () => {
  return <Instructor />;
};

// Protected Route for Course Creation
const CourseCreationRoute = () => {
  const { user } = useSelector((store) => store.auth);
  const userData = user?.user;
  const token = localStorage.getItem("token");

  // If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token exists but no user data, show loading or redirect
  if (token && !userData) {
    return <Navigate to="/login" />;
  }

  // Only instructors can create courses
  if (userData.role !== "instructor") {
    return <Navigate to="/" />;
  }

  // Show course creation
  return <CourseCreation />;
};

export const AllRoutes = () => {
  const location = useLocation();
  const isInstructorPage = location.pathname.startsWith("/instructor");
  const isCourseCreatePage = location.pathname.includes("/course/create");
  const isProfilePage = location.pathname.includes("/profile");

  return (
    <>
      {!isProfilePage && !isCourseCreatePage && <Header />}
      <Routes>
        <Route path="/" element={<Landin />}></Route>
        <Route path="/courses/:id" element={<CoursePage />}></Route>
        <Route path="/course/create" element={<CourseCreationRoute />} />
        <Route path="/course/:id" element={<CoursePage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/profile/edit" element={<ProfilePage />}></Route>
        <Route path="/wishlist" element={<Wishlist />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/teach" element={<InstructorRoutes />}></Route>
        <Route
          path="/instructor/onboard"
          element={<InstructorOnboardingRoute />}
        />
        <Route
          path="/instructor/courses"
          element={<InstructorCoursesRoute />}
        />
        <Route
          path="/instructor/course/:courseId/edit"
          element={<CourseEditPage />}
        />
      </Routes>
      {!isProfilePage && <Footer />}
    </>
  );
};
