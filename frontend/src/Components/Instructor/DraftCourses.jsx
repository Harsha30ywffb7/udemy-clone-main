import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DraftCourses.css";

const DraftCourses = ({ courses = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const navigate = useNavigate();

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1 className="courses-title">Courses</h1>

        <div className="courses-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search your courses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="sort-container">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
            <svg
              className="dropdown-icon"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <button className="new-course-button">New course</button>
        </div>
      </div>

      <div className="announcement-banner">
        <div className="banner-content">
          <span className="new-badge">New</span>
          <div className="banner-text">
            <h3>We upgraded practice tests so you can upgrade yours.</h3>
            <p>
              With our creation improvements, new question types, and generative
              AI features, maximize your practice test's certification prep
              potential.
            </p>
          </div>
          <div className="banner-actions">
            <button className="learn-more-button">Learn more</button>
            <button className="dismiss-button">Dismiss</button>
          </div>
        </div>
      </div>

      <div className="courses-list">
        {courses.map((course) => (
          <div
            key={course._id}
            className="course-card"
            onClick={() =>
              navigate(`/course/${course._id}/manage/intended-learners`)
            }
          >
            <div className="course-thumbnail">
              <div className="thumbnail-placeholder">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect
                    x="4"
                    y="6"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <rect
                    x="8"
                    y="10"
                    width="16"
                    height="1"
                    fill="currentColor"
                  />
                  <rect
                    x="8"
                    y="13"
                    width="12"
                    height="1"
                    fill="currentColor"
                  />
                  <rect x="8" y="16" width="8" height="1" fill="currentColor" />
                  <circle
                    cx="20"
                    cy="26"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <rect
                    x="6"
                    y="24"
                    width="8"
                    height="4"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            <div className="course-info">
              <div className="course-header">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-meta">
                  <span className="course-status">
                    {course.status?.toUpperCase() || "DRAFT"}
                  </span>
                  <span className="course-visibility">Public</span>
                </div>
              </div>

              <div className="course-progress-section">
                {course.isCompleted ? (
                  <div className="completion-status">
                    <span className="completion-text">Finish your course</span>
                  </div>
                ) : (
                  <div className="progress-container">
                    <span className="progress-text">
                      {course.progress > 0
                        ? "Finish your course"
                        : "Finish your course"}
                    </span>
                    {course.progress > 0 && (
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}

                <button className="edit-button">Edit / manage course</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="recommendations">
        <p>
          Based on your experience, we think these resources will be helpful.
        </p>
      </div>
    </div>
  );
};

export default DraftCourses;
