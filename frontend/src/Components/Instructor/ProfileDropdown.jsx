import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileDropdown.css";

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const profileData = [
    {
      listName: "list1",
      topics: [
        { url: "#", topic: "My learning" },
        { url: "#", topic: "My cart" },
        { url: "#", topic: "Wishlist" },
        { url: "/teach", topic: "Teach on Udemy" },
      ],
    },
    {
      listName: "list2",
      topics: [
        { url: "#", topic: "Notifications" },
        { url: "#", topic: "Messages" },
      ],
    },
    {
      listName: "list3",
      topics: [
        { url: "#", topic: "Account settings" },
        { url: "#", topic: "Subscriptions" },
        { url: "#", topic: "Purchase history" },
      ],
    },
    {
      listName: "list4",
      topics: [{ url: "#", topic: "Language" }],
    },
    {
      listName: "list5",
      topics: [
        { url: "#", topic: "Public profile" },
        { url: "#", topic: "Edit profile" },
      ],
    },
    {
      listName: "list6",
      topics: [
        { url: "#", topic: "Help and Support" },
        { url: "/logout", topic: "Logout" },
      ],
    },
  ];

  const getAvatarText = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.toUpperCase().split(" ");
    return names.length > 1
      ? names[0][0] + names[names.length - 1][0]
      : fullName.toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
    } else if (url !== "#") {
      navigate(url);
    }
    setIsOpen(false);
  };

  const fullName = user?.fullName || "User";
  const email = user?.email || "user@example.com";
  const avatarText = getAvatarText(fullName);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <div className="profile-icon" onClick={() => setIsOpen(!isOpen)}>
        {avatarText}
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="user-avatar">
              <div className="avatar-large">{avatarText}</div>
            </div>
            <div className="user-details">
              <p className="user-name">{fullName}</p>
              <p className="user-email">{email}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="menu-items">
            {profileData.map((list, index) => (
              <div key={list.listName} className="menu-list">
                {list.topics.map((item, subIndex) => (
                  <div
                    key={subIndex}
                    className="menu-item"
                    onClick={() => handleItemClick(item.url, item.topic)}
                  >
                    <div className="menu-text">{item.topic}</div>
                    {item.topic === "Language" && (
                      <div className="language-indicator">
                        <span>English</span>
                        <span className="globe-icon">🌐</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Business Section */}
          <div className="business-section">
            <div className="business-content">
              <div>
                <p className="business-title">Udemy Business</p>
                <p className="business-subtitle">
                  Bring learning to your company
                </p>
              </div>
              <span className="export-icon">↗</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
