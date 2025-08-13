import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CourseSidebar.css";

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
        return <div className="status-icon current"></div>;
      case "complete":
        return <div className="status-icon complete">✓</div>;
      case "incomplete":
        return <div className="status-icon incomplete"></div>;
      default:
        return <div className="status-icon incomplete"></div>;
    }
  };

  return (
    <div className="course-sidebar">
      {sidebarData.map((section, sectionIndex) => (
        <div key={sectionIndex} className="sidebar-section">
          <h3 className="section-title">{section.title}</h3>
          <div className="section-items">
            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className={`sidebar-item ${
                  location.pathname === item.route ? "active" : ""
                }`}
                onClick={() => handleItemClick(item.route)}
              >
                <div className="item-content">
                  {getStatusIcon(item.status)}
                  <span className="item-title">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="sidebar-footer">
        <button className="submit-review-btn">Submit for Review</button>
      </div>
    </div>
  );
};

export default CourseSidebar;
