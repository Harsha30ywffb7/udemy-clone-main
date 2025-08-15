import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../Redux/login/action";

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profileData = [
    {
      listName: "list1",
      topics: [
        { url: "/my-learning", topic: "My learning" },
        { url: "/wishlist", topic: "Wishlist" },
      ],
    },
    {
      listName: "list2",
      topics: [
        { url: "/profile", topic: "Public profile" },
        { url: "/profile/edit", topic: "Edit profile" },
      ],
    },
    {
      listName: "list3",
      topics: [{ url: "/logout", topic: "Logout" }],
    },
  ];

  if (user.userType === "student") {
    profileData[0].topics.push({ url: "/teach", topic: "Teach on Udemy" });
  }

  const getAvatarText = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.toUpperCase().split(" ");
    return names.length > 1
      ? names[0][0] + names[names.length - 1][0]
      : fullName.toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    // Dispatch logout action to clear Redux state and localStorage
    dispatch(logoutUser());

    // Navigate to home page
    navigate("/");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (url, topic) => {
    if (topic === "Logout") {
      handleLogout();
    } else if (topic === "Student Mode") {
      // Set student mode flag and navigate to home page
      sessionStorage.setItem("studentMode", "true");
      navigate("/");
    } else if (url !== "#") {
      navigate(url);
    }
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const fullName = user?.fullName || "User";
  const email = user?.email || "user@example.com";
  const avatarText = getAvatarText(fullName);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div
        className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-200 z-[999999]"
        onClick={handleProfileClick}
      >
        {avatarText}
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 w-[270px] bg-white border border-gray-200 rounded shadow-lg z-[999999] mt-2 text-gray-800 font-normal text-sm leading-tight">
          {/* Profile Section */}
          <div className="flex border-b border-gray-300 p-4 cursor-pointer transition-colors duration-300 hover:bg-purple-50">
            <div className="w-[30%] flex items-center">
              <div className="w-16 h-16 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-xl">
                {avatarText}
              </div>
            </div>
            <div className="w-[70%] leading-tight pl-3">
              <p className="text-gray-800 font-bold text-base m-0">
                {fullName}
              </p>
              <p className="text-xs text-gray-500 mt-1 m-0 overflow-hidden text-ellipsis whitespace-nowrap font-normal">
                {email}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
            {profileData.map((list, index) => (
              <div
                key={list.listName}
                className="border-b border-gray-300 py-2"
              >
                {list.topics.map((item, subIndex) => (
                  <div
                    key={subIndex}
                    className="flex justify-between items-center px-4 py-2 cursor-pointer transition-all duration-300 hover:bg-purple-50 hover:text-purple-600"
                    onClick={() => handleItemClick(item.url, item.topic)}
                  >
                    <div className="text-gray-700 text-sm font-normal hover:text-purple-600">
                      {item.topic}
                    </div>
                    {item.topic === "Language" && (
                      <div className="flex items-center gap-1 text-gray-800 text-sm">
                        <span>English</span>
                        <span className="text-sm">🌐</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Business Section */}
          <div className="border-t border-gray-300">
            <div className="flex justify-between items-center p-4 cursor-pointer transition-colors duration-300 hover:bg-purple-50 group">
              <div>
                <p className="text-gray-800 m-0 font-bold text-base group-hover:text-purple-600">
                  Udemy Business
                </p>
                <p className="text-gray-500 mt-1 m-0 text-sm font-normal">
                  Bring learning to your company
                </p>
              </div>
              <span className="text-lg text-gray-800 group-hover:text-purple-600">
                ↗
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
