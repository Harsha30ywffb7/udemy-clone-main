import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
          icon: "📝",
        },
      ],
    },
    {
      id: 2,
      title: "How about a working title?",
      subtitle:
        "It's ok if you can't think of a good one yet. You can change it later.",
      placeholder: "e.g. Learn Photoshop CS6 from Scratch",
    },
    {
      id: 3,
      title: "What category best fits the knowledge you'll share?",
      subtitle:
        "If you're not sure about the right category, you can change it later.",
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
      ],
    },
    {
      id: 4,
      title: "How much time can you spend creating your course per week?",
      subtitle:
        "There's no wrong answer. We can help you create a course that fits your schedule.",
      options: [
        {
          id: "0-2",
          title: "0-2 hours",
          description: "I can only work on this on the side",
        },
        {
          id: "3-5",
          title: "3-5 hours",
          description: "I can work on this regularly",
        },
        {
          id: "6-10",
          title: "6-10 hours",
          description: "I have lots of flexibility",
        },
        {
          id: "10+",
          title: "10+ hours",
          description: "I have plenty of time to focus on this",
        },
      ],
    },
  ];

  const handleOptionSelect = (value) => {
    const stepKey = {
      1: "courseType",
      2: "title",
      3: "category",
      4: "timeCommitment",
    };

    setCourseData({
      ...courseData,
      [stepKey[currentStep]]: value,
    });

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleInputChange = (e) => {
    setCourseData({
      ...courseData,
      title: e.target.value,
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleContinue = () => {
    if (currentStep === 2 && courseData.title.trim()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep > 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/courses",
        {
          title: courseData.title,
          category: courseData.category,
          type: courseData.courseType,
          timeCommitment: courseData.timeCommitment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/instructor/courses");
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center">
            <img
              src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg"
              alt="Udemy"
              className="h-8"
            />
          </Link>
          <button
            onClick={() => navigate("/instructor/courses")}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-gray-100 px-6 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
            <div className="flex-1 bg-gray-300 rounded-full h-2 ml-4">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Step Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentStepData?.title}
            </h1>
            {currentStepData?.subtitle && (
              <p className="text-lg text-gray-600">
                {currentStepData.subtitle}
              </p>
            )}
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {/* Step 1 & 4: Option Cards */}
            {(currentStep === 1 || currentStep === 4) && (
              <div className="space-y-4">
                {currentStepData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {option.title}
                        </h3>
                        <p className="text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Title Input */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder={currentStepData.placeholder}
                    value={courseData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors duration-200"
                    maxLength="60"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {courseData.title.length}/60
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={!courseData.title.trim()}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Category Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentStepData.options.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleOptionSelect(category)}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-all duration-200 text-left"
                    >
                      <span className="text-gray-900 font-medium">
                        {category}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Previous
                  </button>
                </div>
              </div>
            )}

            {/* Final Step: Course Creation Summary */}
            {currentStep > steps.length && (
              <div className="text-center space-y-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    You're ready to create your course!
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Based on your selections, we'll help you create an amazing
                    learning experience.
                  </p>
                </div>

                {/* Course Summary */}
                <div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Course Summary:
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">
                        {courseData.courseType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium">{courseData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{courseData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Commitment:</span>
                      <span className="font-medium">
                        {courseData.timeCommitment} hours/week
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateCourse}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Create Course
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseCreation;
