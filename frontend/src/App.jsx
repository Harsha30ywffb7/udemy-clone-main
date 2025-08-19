import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "./Redux/login/action";
import { AllRoutes } from "./Components/Routes/router";

export const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((store) => store.auth);
  const [isAppInitialized, setIsAppInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem("token");
      console.log("🚀 APP INITIALIZATION - Checking for stored token...");

      if (token) {
        console.log(
          "✅ TOKEN FOUND in localStorage:",
          token.substring(0, 20) + "..."
        );
        console.log(
          "🔄 TOKEN PERSISTENCE - Token will persist until explicit logout"
        );

        // If token exists but no user data in store, fetch user data
        if (!user?.user || !user?.token) {
          console.log(
            "📡 TOKEN EXISTS but no user data in store - fetching user data..."
          );
          await dispatch(fetchUserData(token));
        } else {
          console.log(
            "✅ USER ALREADY AUTHENTICATED and in store - skipping fetch"
          );
        }
      } else {
        console.log("❌ NO TOKEN found in localStorage - proceeding as guest");
      }

      // Mark app as initialized after auth check
      console.log("✅ APP INITIALIZATION COMPLETE");
      setIsAppInitialized(true);
    };

    initializeApp();
  }, [dispatch]);

  // Listen for storage changes (token being cleared from other tabs/sources)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (e.newValue === null) {
          console.log(
            "🚨 STORAGE EVENT - Token was CLEARED from localStorage!"
          );
          console.log(
            "🚨 STORAGE EVENT - Old value was:",
            e.oldValue ? e.oldValue.substring(0, 20) + "..." : "null"
          );
        } else if (e.oldValue === null) {
          console.log("🚨 STORAGE EVENT - Token was SET in localStorage!");
          console.log(
            "🚨 STORAGE EVENT - New value is:",
            e.newValue ? e.newValue.substring(0, 20) + "..." : "null"
          );
        } else {
          console.log("🚨 STORAGE EVENT - Token was CHANGED in localStorage!");
          console.log(
            "🚨 STORAGE EVENT - Old value:",
            e.oldValue ? e.oldValue.substring(0, 20) + "..." : "null"
          );
          console.log(
            "🚨 STORAGE EVENT - New value:",
            e.newValue ? e.newValue.substring(0, 20) + "..." : "null"
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Show loading screen while app is initializing
  if (
    !isAppInitialized ||
    (localStorage.getItem("token") && loading && !user?.user)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Loading Udemy Clone
          </h2>
          <p className="text-gray-600 text-lg mb-1">
            Initializing your session...
          </p>
          <p className="text-gray-500 text-sm">
            Please wait while we set up your experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-cont">
      <AllRoutes />
    </div>
  );
};
