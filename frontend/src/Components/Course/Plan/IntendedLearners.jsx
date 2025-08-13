import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourseSidebar from "../CourseSidebar";
import "./IntendedLearners.css";

const IntendedLearners = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [learningObjectives, setLearningObjectives] = useState([
    "Define the roles and responsibilities of a project manager",
    "Estimate project timelines and budgets",
    "Identify and manage project risks",
    "Complete a case study to manage a project from conception to completion",
  ]);
  const [requirements, setRequirements] = useState([
    "No programming experience needed. You will learn everything you need to know",
  ]);
  const [intendedLearners, setIntendedLearners] = useState([
    "Beginner Python developers curious about data science",
  ]);

  // Static data arrays
  const staticData = {
    pageTitle: "Intended learners",
    description:
      "The following descriptions will be visible on your Course Landing Page and impact your course performance. These descriptions will help learners decide if your course is right for them.",

    learningObjectivesSection: {
      title: "What will students learn in your course?",
      instruction:
        "You must enter at least 4 learning objectives or outcomes that learners can expect to achieve after completing your course.",
      examples: [
        "Define the roles and responsibilities of a project manager",
        "Estimate project timelines and budgets",
        "Identify and manage project risks",
        "Complete a case study to manage a project from conception to completion",
      ],
      addMoreText: "+ Add more to your response",
    },

    requirementsSection: {
      title:
        "What are the requirements or prerequisites for taking your course?",
      instruction:
        "List the required skills, experience, tools or equipment learners should have prior to taking your course. If there are no requirements, use this space as an opportunity to lower the barrier for beginners.",
      examples: [
        "No programming experience needed. You will learn everything you need to know",
      ],
      addMoreText: "+ Add more to your response",
    },

    intendedLearnersSection: {
      title: "Who is this course for?",
      instruction:
        "Write a clear description of the intended learners for your course who will find your course content valuable. This will help you attract the right learners to your course.",
      examples: ["Beginner Python developers curious about data science"],
      addMoreText: "+ Add more to your response",
    },
  };

  const handleInputChange = (index, value, field) => {
    if (field === "learningObjectives") {
      const newObjectives = [...learningObjectives];
      newObjectives[index] = value;
      setLearningObjectives(newObjectives);
    } else if (field === "requirements") {
      const newRequirements = [...requirements];
      newRequirements[index] = value;
      setRequirements(newRequirements);
    } else if (field === "intendedLearners") {
      const newIntendedLearners = [...intendedLearners];
      newIntendedLearners[index] = value;
      setIntendedLearners(newIntendedLearners);
    }
  };

  const addMoreField = (field) => {
    if (field === "learningObjectives") {
      setLearningObjectives([...learningObjectives, ""]);
    } else if (field === "requirements") {
      setRequirements([...requirements, ""]);
    } else if (field === "intendedLearners") {
      setIntendedLearners([...intendedLearners, ""]);
    }
  };

  const renderInputField = (value, index, field, placeholder) => (
    <div key={index} className="input-field-container">
      <input
        type="text"
        value={value}
        onChange={(e) => handleInputChange(index, e.target.value, field)}
        placeholder={placeholder}
        className="text-input"
        maxLength={160}
      />
      <span className="char-count">{value.length}/160</span>
    </div>
  );

  return (
    <div className="intended-learners-page">
      <CourseSidebar
        courseId={courseId}
        courseTitle="Data structures and algorithms"
      />

      <div className="main-content">
        <div className="page-header">
          <button
            className="back-button"
            onClick={() => navigate("/instructor/courses")}
          >
            ← Back to courses
          </button>
          <div className="course-info">
            <h1 className="course-title">Data structures and algorithms</h1>
            <span className="draft-badge">DRAFT</span>
            <span className="video-content">
              0min of video content uploaded
            </span>
          </div>
        </div>

        <div className="content-area">
          <h2 className="page-title">{staticData.pageTitle}</h2>
          <p className="page-description">{staticData.description}</p>

          {/* Learning Objectives Section */}
          <div className="section">
            <h3 className="section-title">
              {staticData.learningObjectivesSection.title}
            </h3>
            <p className="section-instruction">
              {staticData.learningObjectivesSection.instruction}
            </p>

            <div className="input-fields">
              {learningObjectives.map((objective, index) =>
                renderInputField(
                  objective,
                  index,
                  "learningObjectives",
                  staticData.learningObjectivesSection.examples[index] ||
                    "Enter learning objective"
                )
              )}
            </div>

            <button
              className="add-more-btn"
              onClick={() => addMoreField("learningObjectives")}
            >
              {staticData.learningObjectivesSection.addMoreText}
            </button>
          </div>

          {/* Requirements Section */}
          <div className="section">
            <h3 className="section-title">
              {staticData.requirementsSection.title}
            </h3>
            <p className="section-instruction">
              {staticData.requirementsSection.instruction}
            </p>

            <div className="input-fields">
              {requirements.map((requirement, index) =>
                renderInputField(
                  requirement,
                  index,
                  "requirements",
                  staticData.requirementsSection.examples[index] ||
                    "Enter requirement"
                )
              )}
            </div>

            <button
              className="add-more-btn"
              onClick={() => addMoreField("requirements")}
            >
              {staticData.requirementsSection.addMoreText}
            </button>
          </div>

          {/* Intended Learners Section */}
          <div className="section">
            <h3 className="section-title">
              {staticData.intendedLearnersSection.title}
            </h3>
            <p className="section-instruction">
              {staticData.intendedLearnersSection.instruction}
            </p>

            <div className="input-fields">
              {intendedLearners.map((learner, index) =>
                renderInputField(
                  learner,
                  index,
                  "intendedLearners",
                  staticData.intendedLearnersSection.examples[index] ||
                    "Enter intended learner description"
                )
              )}
            </div>

            <button
              className="add-more-btn"
              onClick={() => addMoreField("intendedLearners")}
            >
              {staticData.intendedLearnersSection.addMoreText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntendedLearners;
