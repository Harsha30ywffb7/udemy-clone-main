import { Route, Routes, Navigate } from "react-router-dom";
import { Bottombar } from "../Bottom/Bottombar";
import { CartPage } from "../Cart/Cart";
import { Header } from "../Header/Header";
import { Landigpage } from "../LandingPage/Landin";
import Login from "../Login_Signup/Login";
import Signup from "../Login_Signup/Signup";
import Payment from "../Payment/Payment";
import { Product } from "../Product/Product";
import Wishlist from "../Wishlist/Wishlist";
import Instructor from "../Login_Signup/Instructor";
import InstructorOnboarding from "../Instructor/InstructorOnboarding";
import InstructorCourses from "../Instructor/InstructorCourses";
import CourseCreation from "../Instructor/CourseCreation";
import CourseEditPage from "../Instructor/CourseEditPage";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import CourseAddPage from "../Course/CourseAddPage";
import IntendedLearners from "../Course/Plan/IntendedLearners";

// Protected Route for Instructor Onboarding
const InstructorOnboardingRoute = () => {
  const { user } = useSelector((store) => store.auth);
  const userData = user?.user;

  // If not logged in, redirect to login
  if (!userData) {
    return <Navigate to="/login" />;
  }

  // If not an instructor, redirect to home
  if (userData.userType !== "instructor") {
    return <Navigate to="/" />;
  }

  // If already onboarded, redirect to courses
  if (userData.isOnboarded) {
    return <Navigate to="/instructor/courses" />;
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

  // If not an instructor, redirect to home
  if (userData.userType !== "instructor") {
    return <Navigate to="/" />;
  }

  // If not onboarded, redirect to onboarding
  if (!userData.isOnboarded) {
    return <Navigate to="/instructor/onboard" />;
  }

  // Show courses
  return <InstructorCourses />;
};

// Protected Route for Course Creation
const CourseCreationRoute = () => {
  const { user } = useSelector((store) => store.auth);
  const userData = user?.user;

  // If not logged in, redirect to login
  if (!userData) {
    return <Navigate to="/login" />;
  }

  // If not an instructor, redirect to home
  if (userData.userType !== "instructor") {
    return <Navigate to="/" />;
  }

  // If not onboarded, redirect to onboarding
  if (!userData.isOnboarded) {
    return <Navigate to="/instructor/onboard" />;
  }

  // Show course creation
  return <CourseCreation />;
};

export const AllRoutes = () => {
  const location = useLocation();
  const isInstructorPage = location.pathname.startsWith("/instructor");
  const { user } = useSelector((store) => store.auth);
  const userData = user?.user;

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landigpage />}></Route>
        <Route path="/courses/:id" element={<Product />}></Route>

        <Route path="/cart" element={<CartPage />}></Route>
        <Route path="/wishlist" element={<Wishlist />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/teach" element={<Instructor />}></Route>
        <Route
          path="/course/:courseId/manage/goals"
          element={<CourseAddPage />}
        ></Route>
        <Route
          path="/course/:courseId/manage/intended-learners"
          element={<IntendedLearners />}
        ></Route>
        <Route
          path="/instructor/onboard"
          element={<InstructorOnboardingRoute />}
        />
        <Route
          path="/instructor/courses"
          element={<InstructorCoursesRoute />}
        />
        <Route path="/course/create" element={<CourseCreationRoute />} />
        <Route
          path="/instructor/course/:courseId/edit"
          element={<CourseEditPage />}
        />
      </Routes>
      {/* <Bottombar /> */}
    </>
  );
};
