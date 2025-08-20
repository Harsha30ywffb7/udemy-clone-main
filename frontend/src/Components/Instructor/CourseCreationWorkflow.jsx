import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CourseLandingPage from "./CourseLandingPage";
import CurriculumBuilder from "./CurriculumBuilder";
import PublishStep from "./PublishStep";
import { courseService } from "../../services/courseService";

const STEPS = [
  {
    id: "landing-page",
    title: "Course Landing Page",
    description: "Set up your course details, description, and pricing",
    required: true,
  },
  {
    id: "curriculum",
    title: "Curriculum",
    description: "Create sections and add lectures, quizzes, and assignments",
    required: true,
  },
  {
    id: "publish",
    title: "Publish Course",
    description: "Review and publish your course",
    required: false,
  },
];

const CourseCreationWorkflow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams();
  const [currentStep, setCurrentStep] = useState("landing-page");
  const [courseData, setCourseData] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Determine if this is create or edit mode based on route
  const isCreateMode = location.pathname.includes("/create/");
  const isEditMode = location.pathname.includes("/edit/");

  console.log("🎯 WORKFLOW INITIALIZED:", {
    courseId,
    currentStep,
    isCreateMode,
    isEditMode,
    pathname: location.pathname,
  });

  // Load existing course data if editing or continuing creation
  useEffect(() => {
    if (courseId && (isCreateMode || isEditMode)) {
      console.log(
        "📥 LOADING COURSE DATA for ID:",
        courseId,
        "Mode:",
        isCreateMode ? "CREATE" : "EDIT"
      );
      loadCourseData();
    } else {
      console.log("🆕 NEW COURSE WORKFLOW - No courseId provided");
    }
  }, [courseId, isCreateMode, isEditMode]);

  const loadCourseData = async () => {
    setLoading(true);
    try {
      console.log("📡 FETCHING COURSE DATA...");
      const response = await courseService.getCourseForEdit(courseId);
      if (response.success) {
        console.log("✅ COURSE DATA LOADED:", response.data);
        setCourseData(response.data);

        // Determine completed steps based on data
        const completed = new Set();

        // Check landing page completion
        if (response.data.title && response.data.title.trim()) {
          completed.add("landing-page");
          console.log("✅ LANDING PAGE STEP MARKED AS COMPLETED");
        }

        // Check curriculum completion
        if (response.data.sections && response.data.sections.length > 0) {
          completed.add("curriculum");
          console.log("✅ CURRICULUM STEP MARKED AS COMPLETED");
        }

        // Check if course has completedSteps from backend
        if (
          response.data.completedSteps &&
          Array.isArray(response.data.completedSteps)
        ) {
          response.data.completedSteps.forEach((step) => {
            completed.add(step);
            console.log(
              `✅ STEP ${step.toUpperCase()} MARKED AS COMPLETED FROM BACKEND`
            );
          });
        }

        setCompletedSteps(completed);
      }
    } catch (error) {
      console.error("❌ ERROR LOADING COURSE DATA:", error);
      // If course not found and we're in create mode, that's expected for new courses
      if (isCreateMode) {
        console.log(
          "📝 CREATE MODE - Course not found is expected for new drafts"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = (stepId, data, newCourseId = null) => {
    console.log("🎯 STEP COMPLETED:", {
      stepId,
      newCourseId,
      mode: isCreateMode ? "CREATE" : "EDIT",
    });

    setCompletedSteps((prev) => new Set([...prev, stepId]));

    if (stepId === "landing-page") {
      setCourseData((prev) => ({ ...prev, ...data }));

      // Handle navigation based on mode and whether a new course was created
      if (newCourseId && isCreateMode) {
        // New course created, redirect will be handled by CourseLandingPage component
        console.log(
          "🔀 NEW COURSE CREATED - Redirect handled by CourseLandingPage"
        );
      } else if (isEditMode) {
        // Editing existing course, auto-advance to curriculum
        console.log("🔀 EDIT MODE - Auto-advancing to curriculum");
        setCurrentStep("curriculum");
      } else if (isCreateMode && !newCourseId) {
        // Continue creation flow, auto-advance to curriculum
        console.log("🔀 CREATE MODE - Auto-advancing to curriculum");
        setCurrentStep("curriculum");
      }
    } else if (stepId === "curriculum") {
      // Update course data with curriculum information
      if (data && data.sections) {
        setCourseData((prev) => ({ ...prev, sections: data.sections }));
      }
      console.log(
        "✅ CURRICULUM STEP COMPLETED - Next button should now be enabled"
      );
    } else if (stepId === "publish") {
      // Update course data with publish information
      if (data && data.status) {
        setCourseData((prev) => ({ ...prev, status: data.status }));
      }
      console.log("✅ PUBLISH STEP COMPLETED - Course published successfully");
    }
  };

  const canAccessStep = (stepId) => {
    const stepIndex = STEPS.findIndex((step) => step.id === stepId);
    if (stepIndex === 0) return true;

    // Check if previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      if (STEPS[i].required && !completedSteps.has(STEPS[i].id)) {
        return false;
      }
    }
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "landing-page":
        return (
          <CourseLandingPage
            courseId={courseId}
            initialData={courseData}
            onSave={(data, newCourseId) =>
              handleStepComplete("landing-page", data, newCourseId)
            }
          />
        );

      case "curriculum":
        return (
          <CurriculumBuilder
            courseId={courseId || courseData?.courseId}
            initialSections={courseData?.sections || []}
            onSave={(data) => handleStepComplete("curriculum", data)}
          />
        );

      case "publish":
        return (
          <PublishStep
            courseId={courseId || courseData?.courseId}
            courseData={courseData}
            onPublish={(data) => handleStepComplete("publish", data)}
            onBack={() => setCurrentStep("curriculum")}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with mode indicator */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {isCreateMode ? "Create New Course" : "Edit Course"}
            </h1>
            {courseData?.title && (
              <p className="text-sm text-gray-600 mt-1">{courseData.title}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isCreateMode
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {isCreateMode ? "CREATE MODE" : "EDIT MODE"}
            </span>
            {courseData?.status && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  courseData.status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : courseData.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {courseData.status.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {courseId ? "Edit Course" : "Create New Course"}
            </h1>

            {/* Step Progress */}
            <div className="flex items-center space-x-8">
              {STEPS.map((step, index) => {
                const isCompleted = completedSteps.has(step.id);
                const isCurrent = currentStep === step.id;
                const canAccess = canAccessStep(step.id);

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => canAccess && setCurrentStep(step.id)}
                      disabled={!canAccess}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        isCurrent
                          ? "bg-purple-100 text-purple-700"
                          : canAccess
                          ? "hover:bg-gray-100 text-gray-700"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center justify-center w-6 h-6">
                        {isCompleted ? (
                          <CheckCircleIcon
                            style={{ fontSize: 20 }}
                            className="text-green-500"
                          />
                        ) : (
                          <RadioButtonUncheckedIcon
                            style={{ fontSize: 20 }}
                            className={
                              isCurrent ? "text-purple-600" : "text-gray-400"
                            }
                          />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs text-gray-500">
                          {step.description}
                        </div>
                      </div>
                    </button>

                    {index < STEPS.length - 1 && (
                      <ArrowForwardIcon
                        style={{ fontSize: 16 }}
                        className="text-gray-400 mx-2"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">{renderStepContent()}</div>

      {/* Navigation Footer */}
      <div className="bg-white border-t fixed bottom-0 left-0 right-0">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Step {STEPS.findIndex((s) => s.id === currentStep) + 1} of{" "}
              {STEPS.length}
            </div>

            <div className="flex gap-3">
              {currentStep !== "landing-page" && (
                <button
                  onClick={() => {
                    const currentIndex = STEPS.findIndex(
                      (s) => s.id === currentStep
                    );
                    if (currentIndex > 0) {
                      setCurrentStep(STEPS[currentIndex - 1].id);
                    }
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2"
                >
                  <ArrowBackIcon style={{ fontSize: 16 }} />
                  Previous
                </button>
              )}

              {currentStep !== "publish" && (
                <button
                  onClick={() => {
                    const currentIndex = STEPS.findIndex(
                      (s) => s.id === currentStep
                    );
                    if (currentIndex < STEPS.length - 1) {
                      const nextStep = STEPS[currentIndex + 1];
                      if (canAccessStep(nextStep.id)) {
                        setCurrentStep(nextStep.id);
                      }
                    }
                  }}
                  disabled={!completedSteps.has(currentStep)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ArrowForwardIcon style={{ fontSize: 16 }} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreationWorkflow;
