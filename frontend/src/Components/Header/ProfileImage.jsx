import React from "react";
import { useSelector } from "react-redux";

const ProfileImage = ({
  size = "md",
  className = "",
  showBorder = true,
  user = null,
}) => {
  const { user: authUser } = useSelector((store) => store.auth);
  const currentUser = user || authUser?.user;

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const firstName = name.first || "";
    const lastName = name.last || "";
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const profilePicture = currentUser?.profilePicture || currentUser?.avatarUrl;

  if (profilePicture) {
    return (
      <img
        src={profilePicture}
        alt={`${currentUser?.name?.first || "User"} ${
          currentUser?.name?.last || ""
        }`}
        className={`${sizeClasses[size]} ${
          showBorder ? "border-2 border-gray-200" : ""
        } rounded-full object-cover ${className}`}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${
        showBorder ? "border-2 border-gray-200" : ""
      } rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-600 ${className}`}
    >
      {getInitials(currentUser?.name)}
    </div>
  );
};

export default ProfileImage;
