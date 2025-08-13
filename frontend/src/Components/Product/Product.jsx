import React, { useState, useEffect } from "react";
import "./Product.css";
import { useParams } from "react-router-dom";
import axios from "axios";

import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LanguageIcon from "@mui/icons-material/Language";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ArticleIcon from "@mui/icons-material/Article";
import DownloadIcon from "@mui/icons-material/Download";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShareIcon from "@mui/icons-material/Share";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export const Product = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      axios
        .get(`https://udemy-vr4p.onrender.com/courses/${id}`)
        .then(({ data }) => {
          setCourse(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error fetching course:", err);
          setError("Failed to load course");
          setLoading(false);
        });
    }
  }, [id]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (loading) {
    return (
      <div className="course-loading">
        <div className="loading-spinner">Loading course...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-error">
        <div className="error-message">{error || "Course not found"}</div>
      </div>
    );
  }

  return (
    <div className="course-page">
      {/* Course Header Section */}
      <div className="course-header">
        <div className="course-header-content">
          <div className="course-main-info">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
              <span>Development</span>
              <span className="breadcrumb-arrow">›</span>
              <span>Programming Languages</span>
              <span className="breadcrumb-arrow">›</span>
              <span>Data Analysis</span>
            </div>

            {/* Course Title */}
            <h1 className="course-title">{course.title}</h1>

            {/* Course Subtitle */}
            <p className="course-subtitle">
              Learn python and how to use it to analyze, visualize and present
              data. Includes tons of sample code and hours of video!
            </p>

            {/* Course Stats */}
            <div className="course-stats">
              <div className="rating-section">
                <span className="rating-number">4.3</span>
                <div className="stars">
                  <StarIcon className="star-icon" />
                  <StarIcon className="star-icon" />
                  <StarIcon className="star-icon" />
                  <StarIcon className="star-icon" />
                  <StarIcon className="star-icon" />
                </div>
                <span className="rating-text">(17,379 ratings)</span>
                <span className="students-count">185,449 students</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="instructor-info">
              <span className="instructor-label">Created by </span>
              <span className="instructor-name">Jose Portilla</span>
            </div>

            {/* Course Meta */}
            <div className="course-meta">
              <div className="meta-item">
                <AccessTimeIcon className="meta-icon" />
                <span className="meta-text">Last updated 9/2019</span>
              </div>
              <div className="meta-item">
                <LanguageIcon className="meta-icon" />
                <span className="meta-text">English</span>
              </div>
              <div className="meta-item">
                <ClosedCaptionIcon className="meta-icon" />
                <span className="meta-text">
                  English [Auto], Indonesian [Auto],{" "}
                </span>
                <span className="meta-link">6 more</span>
              </div>
            </div>

            {/* Premium Badge */}
            <div className="premium-badge">
              <div className="premium-icon">✓</div>
              <div className="premium-text">
                Access this top-rated course, plus 26,000+ more top-rated
                courses, with a Udemy plan.{" "}
                <span className="premium-link">See Plans & Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="course-content">
        <div className="content-wrapper">
          {/* Left Column - Course Details */}
          <div className="course-details">
            {/* What You'll Learn Section */}
            <div className="learning-section">
              <h2 className="section-title">What you'll learn</h2>
              <div className="learning-grid">
                <div className="learning-item">
                  <CheckCircleIcon className="check-icon" />
                  <span>
                    Have an intermediate skill level of Python programming.
                  </span>
                </div>
                <div className="learning-item">
                  <CheckCircleIcon className="check-icon" />
                  <span>Use the Jupyter Notebook Environment.</span>
                </div>
                <div className="learning-item">
                  <CheckCircleIcon className="check-icon" />
                  <span>
                    Use the numpy library to create and manipulate arrays.
                  </span>
                </div>
                <div className="learning-item">
                  <CheckCircleIcon className="check-icon" />
                  <span>
                    Use the pandas module with Python to create and structure
                    data.
                  </span>
                </div>
                <div className="learning-item">
                  <CheckCircleIcon className="check-icon" />
                  <span>
                    Learn how to create data visualizations with matplotlib.
                  </span>
                </div>
                <div className="learning-item">
                  <CheckCircleIcon className="check-icon" />
                  <span>Use the seaborn module for statistical graphics.</span>
                </div>
              </div>
            </div>

            {/* Course Content Section */}
            <div className="course-curriculum">
              <h2 className="section-title">Course content</h2>
              <div className="curriculum-stats">
                <span>19 sections • 155 lectures • 21h 15m total length</span>
              </div>

              <div className="curriculum-sections">
                {course.sections?.map((section, index) => (
                  <div key={index} className="curriculum-section">
                    <div
                      className="section-header"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="section-info">
                        <div className="section-title">
                          {expandedSections[index] ? (
                            <ExpandLessIcon className="expand-icon" />
                          ) : (
                            <ExpandMoreIcon className="expand-icon" />
                          )}
                          <span>{section.title}</span>
                        </div>
                        <div className="section-meta">
                          <span>{section.lectures?.length || 0} lectures</span>
                          <span>•</span>
                          <span>{section.duration || "0min"}</span>
                        </div>
                      </div>
                    </div>

                    {expandedSections[index] && (
                      <div className="section-lectures">
                        {section.lectures?.map((lecture, lectureIndex) => (
                          <div key={lectureIndex} className="lecture-item">
                            <PlayCircleOutlineIcon className="lecture-icon" />
                            <span className="lecture-title">
                              {lecture.title}
                            </span>
                            <span className="lecture-duration">
                              {lecture.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button className="more-sections-btn">19 more sections</button>
            </div>
          </div>

          {/* Right Column - Pricing Sidebar */}
          <div className="course-sidebar">
            <div className="sidebar-content">
              {/* Course Preview */}
              <div className="course-preview">
                <div className="preview-thumbnail">
                  <PlayCircleOutlineIcon className="preview-play-icon" />
                  <span className="preview-text">Preview this course</span>
                </div>
              </div>

              {/* Pricing Tabs */}
              <div className="pricing-tabs">
                <button className="tab-button active">Personal</button>
                <button className="tab-button">Teams</button>
              </div>

              {/* Premium Badge */}
              <div className="sidebar-premium">
                <div className="premium-check">✓</div>
                <span>This Premium course is included in plans</span>
              </div>

              {/* Subscription Option */}
              <div className="subscription-option">
                <h3 className="subscription-title">
                  Subscribe to Udemy's top courses
                </h3>
                <p className="subscription-desc">
                  Get this course, plus 26,000+ of our top-rated courses, with
                  Personal Plan.
                  <span className="subscription-link"> Learn more</span>
                </p>
                <button className="subscription-btn">Start subscription</button>
                <div className="subscription-price">
                  <span className="original-price">₹500</span>
                  <span className="discounted-price">₹400</span>
                  <span className="price-period">per month</span>
                </div>
                <span className="cancel-text">Cancel anytime</span>
              </div>

              {/* Divider */}
              <div className="divider">
                <span>or</span>
              </div>

              {/* One-time Purchase */}
              <div className="one-time-purchase">
                <div className="course-price">₹2,989</div>
                <button className="add-to-cart-btn">Add to cart</button>
                <button className="buy-now-btn">Buy now</button>
              </div>

              {/* Guarantees */}
              <div className="guarantees">
                <div className="guarantee-item">
                  30-Day Money-Back Guarantee
                </div>
                <div className="guarantee-item">Full Lifetime Access</div>
              </div>

              {/* Course Includes */}
              <div className="course-includes">
                <h4 className="includes-title">This course includes:</h4>
                <div className="includes-item">
                  <VideoLibraryIcon className="includes-icon" />
                  <span>21 hours on-demand video</span>
                </div>
                <div className="includes-item">
                  <ArticleIcon className="includes-icon" />
                  <span>3 articles</span>
                </div>
                <div className="includes-item">
                  <DownloadIcon className="includes-icon" />
                  <span>4 downloadable resources</span>
                </div>
                <div className="includes-item">
                  <AllInclusiveIcon className="includes-icon" />
                  <span>Full lifetime access</span>
                </div>
                <div className="includes-item">
                  <PhoneAndroidIcon className="includes-icon" />
                  <span>Access on mobile and TV</span>
                </div>
                <div className="includes-item">
                  <EmojiEventsIcon className="includes-icon" />
                  <span>Certificate of completion</span>
                </div>
              </div>

              {/* Action Links */}
              <div className="action-links">
                <button className="action-link">
                  <ShareIcon className="action-icon" />
                  Share
                </button>
                <button className="action-link">
                  <CardGiftcardIcon className="action-icon" />
                  Gift this course
                </button>
                <button className="action-link">
                  <LocalOfferIcon className="action-icon" />
                  Apply Coupon
                </button>
              </div>

              {/* Coupon Applied */}
              <div className="coupon-applied">
                <div className="coupon-info">
                  <span className="coupon-code">LETSLEARNNOW</span>
                  <span className="coupon-label">is applied</span>
                </div>
                <span className="coupon-type">Udemy coupon</span>
              </div>

              {/* Coupon Input */}
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="Enter Coupon"
                  className="coupon-field"
                />
                <button className="apply-coupon-btn">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
