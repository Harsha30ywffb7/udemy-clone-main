import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CourseSidebar = ({ courseId, courseTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarData = [
    {
      title: "Plan your course",
      items: [
        {
          title: "Intended learners",
          route: `/course/${courseId}/manage/goals`,
          status: "current",
          required: true,
        },
        {
          title: "Course structure",
          route: `/course/${courseId}/manage/course-structure`,
          status: "complete",
          required: true,
        },
        {
          title: "Setup & test video",
          route: `/course/${courseId}/manage/setup-test-video`,
          status: "complete",
          required: true,
        },
      ],
    },
    {
      title: "Create your content",
      items: [
        {
          title: "Film & edit",
          route: `/course/${courseId}/manage/film-edit`,
          status: "complete",
          required: true,
        },
        {
          title: "Curriculum",
          route: `/course/${courseId}/manage/curriculum`,
          status: "incomplete",
          required: true,
        },
        {
          title: "Captions (optional)",
          route: `/course/${courseId}/manage/captions`,
          status: "incomplete",
          required: false,
        },
        {
          title: "Accessibility (optional)",
          route: `/course/${courseId}/manage/accessibility`,
          status: "complete",
          required: false,
        },
      ],
    },
    {
      title: "Publish your course",
      items: [
        {
          title: "Course landing page",
          route: `/course/${courseId}/manage/landing-page`,
          status: "incomplete",
          required: true,
        },
        {
          title: "Pricing",
          route: `/course/${courseId}/manage/pricing`,
          status: "incomplete",
          required: true,
        },
        {
          title: "Promotions",
          route: `/course/${courseId}/manage/promotions`,
          status: "complete",
          required: true,
        },
        {
          title: "Course messages",
          route: `/course/${courseId}/manage/course-messages`,
          status: "incomplete",
          required: true,
        },
      ],
    },
  ];

  const handleItemClick = (route) => {
    navigate(route);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "current":
        return (
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-600 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        );
      case "complete":
        return (
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
            ✓
          </div>
        );
      case "incomplete":
        return (
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white"></div>
        );
      default:
        return (
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white"></div>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto p-4">
      {sidebarData.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            {section.title}
          </h3>
          <div className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
                  location.pathname === item.route
                    ? "bg-purple-50 border-l-4 border-purple-500"
                    : "border-l-4 border-transparent"
                }`}
                onClick={() => handleItemClick(item.route)}
              >
                <div className="flex items-center space-x-3 w-full">
                  {getStatusIcon(item.status)}
                  <span
                    className={`text-sm font-medium ${
                      location.pathname === item.route
                        ? "text-purple-700"
                        : "text-gray-700"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200">
          Submit for Review
        </button>
      </div>
    </div>
  );
};

export default CourseSidebar;
