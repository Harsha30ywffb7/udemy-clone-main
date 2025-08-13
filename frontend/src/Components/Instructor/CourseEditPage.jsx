import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseEditPage.css";

const CourseEditPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(response.data.course);
      } catch (error) {
        console.error("Error fetching course:", error);
        navigate("/instructor/courses");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="course-edit-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-edit-error">
        <h2>Course not found</h2>
        <button onClick={() => navigate("/instructor/courses")}>
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="course-edit-page">
      <div className="course-edit-header">
        <div className="header-left">
          <button
            className="back-button"
            onClick={() => navigate("/instructor/courses")}
          >
            ← Back to Courses
          </button>
          <h1>{course.title}</h1>
        </div>
        <div className="header-right">
          <span className="course-status">{course.status}</span>
        </div>
      </div>

      <div className="course-edit-content">
        <div className="course-info-section">
          <h2>Course Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Title:</label>
              <span>{course.title}</span>
            </div>
            <div className="info-item">
              <label>Category:</label>
              <span>{course.category}</span>
            </div>
            <div className="info-item">
              <label>Course Type:</label>
              <span>{course.courseType}</span>
            </div>
            <div className="info-item">
              <label>Time Commitment:</label>
              <span>{course.timeCommitment}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status-${course.status}`}>{course.status}</span>
            </div>
          </div>
        </div>

        <div className="course-actions-section">
          <h2>Course Actions</h2>
          <div className="action-buttons">
            <button className="edit-course-btn">Edit Course</button>
            <button className="preview-course-btn">Preview Course</button>
            <button className="publish-course-btn">Publish Course</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditPage;
