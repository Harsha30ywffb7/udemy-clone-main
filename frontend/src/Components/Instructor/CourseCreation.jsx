import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./CourseCreation.css";

const CourseCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({
    courseType: "",
    title: "",
    category: "",
    timeCommitment: "",
  });
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      title: "First, let's find out what type of course you're making.",
      options: [
        {
          id: "course",
          title: "Course",
          description:
            "Create rich learning experiences with the help of video lectures, quizzes, coding exercises, etc.",
          icon: "▶",
        },
        {
          id: "practice-test",
          title: "Practice Test",
          description:
            "Help students prepare for certification exams by providing practice questions.",
          icon: "📄",
        },
      ],
    },
    {
      id: 2,
      title: "How about a working title?",
      subtitle:
        "It's ok if you can't think of a good title now. You can change it later.",
      inputType: "text",
      placeholder: "e.g. Learn Photoshop CS6 from Scratch",
      maxLength: 60,
    },
    {
      id: 3,
      title: "What category best fits the knowledge you'll share?",
      subtitle:
        "If you're not sure about the right category, you can change it later.",
      inputType: "select",
      options: [
        "Development",
        "Business",
        "Finance & Accounting",
        "IT & Software",
        "Office Productivity",
        "Personal Development",
        "Design",
        "Marketing",
        "Lifestyle",
        "Photography & Video",
        "Health & Fitness",
        "Music",
        "Teaching & Academics",
        "I don't know yet",
      ],
    },
    {
      id: 4,
      title: "How much time can you spend creating your course per week?",
      subtitle:
        "There's no wrong answer. We can help you achieve your goals even if you don't have much time.",
      options: [
        "I'm very busy right now (0-2 hours)",
        "I'll work on this on the side (2-4 hours)",
        "I have lots of flexibility (5+ hours)",
        "I haven't yet decided if I have time",
      ],
    },
  ];

  const currentStepData = steps[currentStep - 1];

  const handleOptionSelect = (optionId) => {
    setCourseData((prev) => ({
      ...prev,
      [currentStepData.id === 1
        ? "courseType"
        : currentStepData.id === 3
        ? "category"
        : currentStepData.id === 4
        ? "timeCommitment"
        : "title"]: optionId,
    }));
  };

  const handleInputChange = (value) => {
    setCourseData((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Create course logic here
      try {
        const token = localStorage.getItem("token");
        const coursePayload = {
          title: courseData.title,
          courseType: courseData.courseType,
          category: courseData.category,
          timeCommitment: courseData.timeCommitment,
          status: "draft",
        };

        const response = await axios.post("/api/courses", coursePayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const courseId = response.data.course._id;

        navigate(`/course/${courseId}/manage/intended-learners`);
      } catch (error) {
        console.error("Error creating course:", error);
        // Still navigate even if there's an error
        navigate("/instructor/courses");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canContinue = () => {
    if (currentStep === 1) return courseData.courseType;
    if (currentStep === 2) return courseData.title.trim();
    if (currentStep === 3) return courseData.category;
    if (currentStep === 4) return courseData.timeCommitment;
    return false;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="options-grid">
              {currentStepData.options.map((option) => (
                <div
                  key={option.id}
                  className={`option-card ${
                    courseData.courseType === option.id ? "selected" : ""
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div className="option-content">
                    <div className="option-icon">{option.icon}</div>
                    <h3 className="option-title">{option.title}</h3>
                    <p className="option-description">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="input-container">
              <input
                type="text"
                className="title-input"
                placeholder={currentStepData.placeholder}
                value={courseData.title}
                onChange={(e) => handleInputChange(e.target.value)}
                maxLength={currentStepData.maxLength}
              />
              <div className="char-count">
                {courseData.title.length}/{currentStepData.maxLength}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="select-container">
              <select
                className="category-select"
                value={courseData.category}
                onChange={(e) => handleOptionSelect(e.target.value)}
              >
                <option value="">Choose a category</option>
                {currentStepData.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="options-list">
              {currentStepData.options.map((option, index) => (
                <div
                  key={index}
                  className={`option-item ${
                    courseData.timeCommitment === option ? "selected" : ""
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <div className="radio-button">
                    <div
                      className={`radio-inner ${
                        courseData.timeCommitment === option ? "selected" : ""
                      }`}
                    ></div>
                  </div>
                  <span className="option-text">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="course-creation">
      {/* Header */}
      <div className="creation-header">
        <div className="header-left">
          <Link to="/" className="udemy-logo">
            <img
              className="udemylogo"
              src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg"
              alt="Udemy"
            />
          </Link>
          <span className="step-indicator">Step {currentStep} of 4</span>
        </div>
        <button
          className="exit-button"
          onClick={() => navigate("/instructor/courses")}
        >
          Exit
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="">
          <h1 className="step-title">{currentStepData.title}</h1>
          {currentStepData.subtitle && (
            <p className="step-subtitle">{currentStepData.subtitle}</p>
          )}
          {renderStepContent()}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="footer-navigation">
        <button
          className="nav-button previous"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          className="nav-button continue"
          onClick={handleNext}
          disabled={!canContinue()}
        >
          {currentStep === 4 ? "Create Course" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default CourseCreation;
