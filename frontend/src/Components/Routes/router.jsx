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
import CourseCreationWorkflow from "../Instructor/CourseCreationWorkflow";
import CourseEditPage from "../Instructor/CourseEditPage";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import CoursePage from "../Course/CoursePage";
import ProfilePage from "../Login_Signup/ProfilePage";

// General Protected Route Component for authenticated users
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const userData = user?.user;
  const token = localStorage.getItem("token");

  console.log("🛡️ PROTECTED ROUTE - Checking authentication...");
  console.log("🛡️ PROTECTED ROUTE - Token exists:", !!token);
  console.log("🛡️ PROTECTED ROUTE - User data exists:", !!userData);

  // If no token, redirect to login
  if (!token) {
    console.log("🚫 PROTECTED ROUTE - No token found, redirecting to login");
    return <Navigate to="/login" />;
  }

  // If token but no user data, redirect to login (invalid token)
  if (!userData) {
    console.log(
      "🚫 PROTECTED ROUTE - Token exists but no user data, redirecting to login"
    );
    return <Navigate to="/login" />;
  }

  console.log("✅ PROTECTED ROUTE - Authentication verified, allowing access");
  return children;
};

// Protected Route Component for Instructors
const InstructorProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const userData = user?.user;
  const token = localStorage.getItem("token");

  console.log("👨‍🏫 INSTRUCTOR ROUTE - Checking instructor authentication...");
  console.log("👨‍🏫 INSTRUCTOR ROUTE - Token exists:", !!token);
  console.log("👨‍🏫 INSTRUCTOR ROUTE - User data exists:", !!userData);
  console.log("👨‍🏫 INSTRUCTOR ROUTE - User role:", userData?.role);

  // If no token, redirect to login
  if (!token) {
    console.log("🚫 INSTRUCTOR ROUTE - No token found, redirecting to login");
    return <Navigate to="/login" />;
  }

  // If token but no user data, redirect to login (invalid token)
  if (!userData) {
    console.log(
      "🚫 INSTRUCTOR ROUTE - Token exists but no user data, redirecting to login"
    );
    return <Navigate to="/login" />;
  }

  // If user exists but is not an instructor, redirect to home
  if (userData.role !== "instructor") {
    console.log(
      "🚫 INSTRUCTOR ROUTE - User is not an instructor, redirecting to home"
    );
    return <Navigate to="/" />;
  }

  console.log("✅ INSTRUCTOR ROUTE - Authentication verified, allowing access");
  return children;
};

// Individual Protected Route Components
const InstructorOnboardingRoute = () => (
  <InstructorProtectedRoute>
    <InstructorOnboarding />
  </InstructorProtectedRoute>
);

const InstructorCoursesRoute = () => (
  <InstructorProtectedRoute>
    <InstructorCourses />
  </InstructorProtectedRoute>
);

const CourseCreationRoute = () => (
  <InstructorProtectedRoute>
    <CourseCreation />
  </InstructorProtectedRoute>
);

const CourseCreationWorkflowRoute = () => (
  <InstructorProtectedRoute>
    <CourseCreationWorkflow />
  </InstructorProtectedRoute>
);

const CourseEditRoute = () => (
  <InstructorProtectedRoute>
    <CourseEditPage />
  </InstructorProtectedRoute>
);

const InstructorRoutes = () => {
  return <Instructor />;
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
        {/* Public Routes */}
        <Route path="/" element={<Landin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teach" element={<InstructorRoutes />} />

        {/* Course Routes */}
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="/course/:id" element={<CoursePage />} />

        {/* User Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* Instructor Routes - Organized and Clean */}
        <Route
          path="/instructor/onboard"
          element={<InstructorOnboardingRoute />}
        />
        <Route
          path="/instructor/courses"
          element={<InstructorCoursesRoute />}
        />

        {/* Course Creation Flow */}
        <Route path="/course/create" element={<CourseCreationRoute />} />
        <Route
          path="/course/create/:courseId"
          element={<CourseCreationWorkflowRoute />}
        />
        <Route
          path="/course/edit/:courseId"
          element={<CourseCreationWorkflowRoute />}
        />

        {/* Legacy Routes - Keep for backward compatibility */}
        <Route
          path="/instructor/course/create"
          element={<CourseCreationWorkflowRoute />}
        />
        <Route
          path="/instructor/course/edit/:courseId"
          element={<CourseCreationWorkflowRoute />}
        />

        {/* Legacy Course Edit Route */}
        <Route
          path="/instructor/course/:courseId/edit"
          element={<CourseEditRoute />}
        />
      </Routes>
      {!isProfilePage && <Footer />}
    </>
  );
};
