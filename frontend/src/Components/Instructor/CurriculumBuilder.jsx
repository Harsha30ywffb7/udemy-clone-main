import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ArticleIcon from "@mui/icons-material/Article";
import ImageIcon from "@mui/icons-material/Image";
import HelpIcon from "@mui/icons-material/Help";
import CodeIcon from "@mui/icons-material/Code";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PresentationIcon from "@mui/icons-material/Slideshow";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SettingsIcon from "@mui/icons-material/Settings";
import { courseService } from "../../services/courseService";

// Content type configurations
const CONTENT_TYPES = {
  video: {
    icon: VideoLibraryIcon,
    label: "Video",
    description: "Add video by URL",
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
  },
  video_slide_mashup: {
    icon: PresentationIcon,
    label: "Video & Slide Mashup",
    description: "Video with synchronized slides",
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
  },
  article: {
    icon: ArticleIcon,
    label: "Article",
    description: "Text-based content",
    color: "bg-green-50 hover:bg-green-100 border-green-200",
  },
  quiz: {
    icon: HelpIcon,
    label: "Quiz",
    description: "Interactive quiz",
    color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
  },
  coding_exercise: {
    icon: CodeIcon,
    label: "Coding Exercise",
    description: "Interactive coding challenge",
    color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
  },
  assignment: {
    icon: AssignmentIcon,
    label: "Assignment",
    description: "Student assignment",
    color: "bg-red-50 hover:bg-red-100 border-red-200",
  },
  practice_test: {
    icon: HelpIcon,
    label: "Practice Test",
    description: "Comprehensive practice test",
    color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
  },
  role_play: {
    icon: PlayCircleIcon,
    label: "Role Play",
    description: "Interactive role-playing exercise",
    color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
    badge: "Beta",
  },
};

// File upload component for non-video content
const FileUploader = ({
  contentType,
  onFileSelect,
  accept,
  maxSize = 100 * 1024 * 1024,
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file) => {
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setUploading(true);
    try {
      // Simulate file upload with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      onFileSelect(file);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragOver
          ? "border-purple-400 bg-purple-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) =>
          e.target.files[0] && handleFileSelect(e.target.files[0])
        }
        className="hidden"
      />

      {uploading ? (
        <div className="space-y-4">
          <div className="animate-spin mx-auto w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
          <p className="text-sm text-gray-600">
            Uploading... {uploadProgress}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <FileUploadIcon
            style={{ fontSize: 48 }}
            className="mx-auto text-gray-400"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Drop your {contentType} file here, or{" "}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-purple-600 hover:text-purple-700 underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept} • Max {maxSize / (1024 * 1024)}MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Content editor component
const ContentEditor = ({ content, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    title: content.title || "",
    description: content.description || "",
    isPreview: content.isPreview || false,
    isFree: content.isFree || false,
    ...content,
  });

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  const renderContentSpecificFields = () => {
    switch (content.contentType) {
      case "video":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL *
              </label>
              <input
                type="url"
                value={formData.video?.url || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    video: { ...prev.video, url: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports direct video URLs, YouTube, Vimeo, and other video
                platforms
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.video?.thumbnailUrl || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    video: { ...prev.video, thumbnailUrl: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Quality
                </label>
                <select
                  value={formData.video?.quality || "1080p"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      video: { ...prev.video, quality: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4K">4K</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={Math.floor((formData.duration || 0) / 60)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) * 60,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        );

      case "video_slide_mashup":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Video URL</h4>
              <input
                type="url"
                value={formData.video?.url || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    video: { ...prev.video, url: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/video.mp4"
                required
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Presentation File
              </h4>
              <FileUploader
                contentType="presentation"
                accept=".ppt,.pptx,.pdf"
                maxSize={50 * 1024 * 1024}
                onFileSelect={(file) => {
                  setFormData((prev) => ({
                    ...prev,
                    slides: { ...prev.slides, file },
                  }));
                }}
              />
            </div>
          </div>
        );

      case "article":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Article Content
              </label>
              <textarea
                value={formData.article?.content || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    article: { ...prev.article, content: e.target.value },
                  }))
                }
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write your article content here..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Read Time (minutes)
              </label>
              <input
                type="number"
                value={formData.article?.estimatedReadTime || 0}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    article: {
                      ...prev.article,
                      estimatedReadTime: parseInt(e.target.value),
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="5"
              />
            </div>
          </div>
        );

      case "quiz":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.quiz?.passingScore || 70}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quiz: {
                        ...prev.quiz,
                        passingScore: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quiz?.maxAttempts || 3}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quiz: {
                        ...prev.quiz,
                        maxAttempts: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowMultipleAttempts"
                checked={formData.quiz?.allowMultipleAttempts || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quiz: {
                      ...prev.quiz,
                      allowMultipleAttempts: e.target.checked,
                    },
                  }))
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="allowMultipleAttempts"
                className="ml-2 block text-sm text-gray-900"
              >
                Allow multiple attempts
              </label>
            </div>
          </div>
        );

      case "coding_exercise":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programming Language
              </label>
              <select
                value={formData.codingExercise?.language || "javascript"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    codingExercise: {
                      ...prev.codingExercise,
                      language: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="html_css">HTML/CSS</option>
                <option value="react">React</option>
                <option value="node">Node.js</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                value={formData.codingExercise?.instructions || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    codingExercise: {
                      ...prev.codingExercise,
                      instructions: e.target.value,
                    },
                  }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe what the student needs to accomplish..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starter Code
              </label>
              <textarea
                value={formData.codingExercise?.starterCode || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    codingExercise: {
                      ...prev.codingExercise,
                      starterCode: e.target.value,
                    },
                  }))
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                placeholder="// Initial code for students..."
              />
            </div>
          </div>
        );

      case "assignment":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Instructions
              </label>
              <textarea
                value={formData.assignment?.instructions || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    assignment: {
                      ...prev.assignment,
                      instructions: e.target.value,
                    },
                  }))
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Provide detailed instructions for the assignment..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Submission Type
                </label>
                <select
                  value={formData.assignment?.submissionType || "file_upload"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      assignment: {
                        ...prev.assignment,
                        submissionType: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="file_upload">File Upload</option>
                  <option value="text_submission">Text Submission</option>
                  <option value="url_submission">URL Submission</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Score
                </label>
                <input
                  type="number"
                  value={formData.assignment?.maxScore || 100}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      assignment: {
                        ...prev.assignment,
                        maxScore: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            Edit {CONTENT_TYPES[content.contentType]?.label}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <CloseIcon style={{ fontSize: 24 }} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter content title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Optional description"
              />
            </div>
          </div>

          {/* Content-specific fields */}
          {renderContentSpecificFields()}

          {/* Settings */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPreview"
                  checked={formData.isPreview}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPreview: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isPreview"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Allow preview (free sample)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={formData.isFree}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFree: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isFree"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Free content
                </label>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors flex items-center gap-2"
            >
              <SaveIcon style={{ fontSize: 16 }} />
              Save Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Curriculum Builder Component
const CurriculumBuilder = ({ courseId, initialSections = [], onSave }) => {
  const [sections, setSections] = useState(
    initialSections.length > 0
      ? initialSections
      : [
          {
            id: Date.now(),
            title: "Introduction",
            description: "",
            sortOrder: 0,
            isPublished: false,
            content: [],
          },
        ]
  );
  const [editingContent, setEditingContent] = useState(null);
  const [saving, setSaving] = useState(false);

  // Add new section
  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${sections.length + 1}`,
      description: "",
      sortOrder: sections.length,
      isPublished: false,
      content: [],
    };
    setSections([...sections, newSection]);
  };

  // Update section
  const updateSection = (sectionId, updates) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    );
  };

  // Delete section
  const deleteSection = (sectionId) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  // Add content to section
  const addContent = (sectionId, contentType) => {
    const newContent = {
      id: Date.now(),
      contentType,
      title: `New ${CONTENT_TYPES[contentType].label}`,
      description: "",
      sortOrder: 0,
      isPreview: false,
      isFree: false,
      duration: 0,
    };

    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              content: [...(section.content || []), newContent],
            }
          : section
      )
    );

    // Open editor for the new content
    setEditingContent({ sectionId, content: newContent });
  };

  // Update content
  const updateContent = (sectionId, contentId, updates) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              content: section.content.map((content) =>
                content.id === contentId ? { ...content, ...updates } : content
              ),
            }
          : section
      )
    );
  };

  // Delete content
  const deleteContent = (sectionId, contentId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              content: section.content.filter(
                (content) => content.id !== contentId
              ),
            }
          : section
      )
    );
  };

  // Save curriculum
  const saveCurriculum = async () => {
    setSaving(true);
    try {
      if (courseId) {
        await courseService.updateCourseCurriculum(courseId, { sections });
      }
      alert("Curriculum saved successfully!");
      if (onSave) {
        onSave({ sections }); // Notify parent of successful save with data
      }
    } catch (error) {
      console.error("Error saving curriculum:", error);
      alert("Failed to save curriculum. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border rounded-md p-6 bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Curriculum</h2>
        <div className="flex items-center gap-3">
          <button className="text-sm text-purple-600 font-medium hover:underline">
            Bulk Uploader
          </button>
          <button
            onClick={saveCurriculum}
            disabled={saving}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <SaveIcon style={{ fontSize: 16 }} />
            {saving ? "Saving..." : "Save Curriculum"}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-2">
        Start putting together your course by creating sections, lectures and
        practice (quizzes, coding exercises and assignments).
      </p>
      <p className="text-sm text-gray-700 mb-4">
        Use your{" "}
        <Link to="/" className="text-purple-600 underline">
          course outline
        </Link>{" "}
        to structure your content and label your sections and lectures clearly.
        If you're intending to offer your course for free, the total length of
        video content must be less than 2 hours.
      </p>

      {/* Sections */}
      {sections.map((section, sectionIndex) => (
        <div key={section.id} className="border rounded-md p-4 bg-gray-50 mb-4">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              value={section.title}
              onChange={(e) =>
                updateSection(section.id, { title: e.target.value })
              }
              className="font-medium text-lg bg-transparent border-none outline-none focus:bg-white focus:border focus:border-gray-300 rounded px-2 py-1"
              placeholder={`Section ${sectionIndex + 1} title`}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateSection(section.id, {
                    isPublished: !section.isPublished,
                  })
                }
                className={`px-3 py-1 text-xs rounded-full ${
                  section.isPublished
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {section.isPublished ? "Published" : "Draft"}
              </button>
              <button
                onClick={() => deleteSection(section.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <CloseIcon style={{ fontSize: 16 }} />
              </button>
            </div>
          </div>

          {/* Section Description */}
          <textarea
            value={section.description}
            onChange={(e) =>
              updateSection(section.id, { description: e.target.value })
            }
            placeholder="Section description (optional)"
            className="w-full text-sm bg-transparent border-none outline-none focus:bg-white focus:border focus:border-gray-300 rounded px-2 py-1 mb-4 resize-none"
            rows={2}
          />

          {/* Content Items */}
          {section.content?.map((content, contentIndex) => (
            <div
              key={content.id}
              className="border rounded-md bg-white shadow-sm mb-3"
            >
              {/* Content Header */}
              <div className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center gap-3">
                  {React.createElement(
                    CONTENT_TYPES[content.contentType]?.icon || ArticleIcon,
                    {
                      style: { fontSize: 16 },
                      className: "text-gray-600",
                    }
                  )}
                  <p className="text-sm font-medium">
                    {contentIndex + 1}. {content.title}
                  </p>
                  {content.isPreview && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Preview
                    </span>
                  )}
                  {content.isFree && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Free
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setEditingContent({ sectionId: section.id, content })
                    }
                    className="text-gray-500 hover:text-purple-600"
                  >
                    <SettingsIcon style={{ fontSize: 16 }} />
                  </button>
                  <button
                    onClick={() => deleteContent(section.id, content.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <CloseIcon style={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>

              {/* Content Body - Show upload/edit interface if not configured */}
              <div className="p-4">
                {!content.configured ? (
                  <div className="text-sm text-gray-600">
                    <p className="mb-3">
                      Select the main type of content. Files and links can be
                      added as resources.{" "}
                      <Link to="/" className="text-purple-600 underline">
                        Learn about content types.
                      </Link>
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(CONTENT_TYPES).map(([type, config]) => {
                        const Icon = config.icon;
                        return (
                          <button
                            key={type}
                            onClick={() => {
                              updateContent(section.id, content.id, {
                                contentType: type,
                                configured: true,
                              });
                              setEditingContent({
                                sectionId: section.id,
                                content: { ...content, contentType: type },
                              });
                            }}
                            className={`border rounded-md h-20 flex flex-col items-center justify-center hover:shadow-md transition-all ${config.color}`}
                          >
                            <Icon style={{ fontSize: 20 }} className="mb-1" />
                            <span className="text-xs font-medium text-center leading-tight">
                              {config.label}
                            </span>
                            {config.badge && (
                              <span className="text-xs text-gray-500 mt-1">
                                {config.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {CONTENT_TYPES[content.contentType]?.label} content
                      </span>
                      {content.duration > 0 && (
                        <span className="text-xs text-gray-500">
                          {Math.floor(content.duration / 60)}:
                          {(content.duration % 60).toString().padStart(2, "0")}
                        </span>
                      )}
                      {content.contentType === "video" &&
                        content.video?.url && (
                          <span className="text-xs text-green-600">
                            ✓ Video URL added
                          </span>
                        )}
                    </div>
                    <button
                      onClick={() =>
                        setEditingContent({ sectionId: section.id, content })
                      }
                      className="text-purple-600 hover:text-purple-700 text-sm"
                    >
                      Edit Content
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Section Footer Buttons */}
          <div className="flex flex-wrap gap-2 mt-4 text-sm">
            <button
              onClick={() => addContent(section.id, "video")}
              className="px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1"
            >
              <AddIcon style={{ fontSize: 16 }} />
              Lecture
              <span className="ml-1 text-green-600 font-semibold">
                With lab
              </span>
            </button>
            <button
              onClick={() => addContent(section.id, "quiz")}
              className="px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1"
            >
              <AddIcon style={{ fontSize: 16 }} />
              Quiz
            </button>
            <button
              onClick={() => addContent(section.id, "coding_exercise")}
              className="px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1"
            >
              <AddIcon style={{ fontSize: 16 }} />
              Coding Exercise
            </button>
            <button
              onClick={() => addContent(section.id, "practice_test")}
              className="px-3 py-2 border rounded-md text-gray-400 cursor-not-allowed flex items-center gap-1"
              disabled
            >
              <AddIcon style={{ fontSize: 16 }} />
              Practice Test
            </button>
            <button
              onClick={() => addContent(section.id, "assignment")}
              className="px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1"
            >
              <AddIcon style={{ fontSize: 16 }} />
              Assignment
            </button>
            <button
              onClick={() => addContent(section.id, "role_play")}
              className="px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1"
            >
              <AddIcon style={{ fontSize: 16 }} />
              Role Play
              <span className="ml-1 text-xs text-gray-500">Beta</span>
            </button>
          </div>
        </div>
      ))}

      {/* Add Section Button */}
      <button
        onClick={addSection}
        className="px-4 py-3 mt-4 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 flex items-center gap-2 w-full justify-center transition-colors"
      >
        <AddIcon style={{ fontSize: 16 }} />
        Add Section
      </button>

      {/* Content Editor Modal */}
      {editingContent && (
        <ContentEditor
          content={editingContent.content}
          onUpdate={(updatedContent) => {
            updateContent(
              editingContent.sectionId,
              editingContent.content.id,
              updatedContent
            );
          }}
          onClose={() => setEditingContent(null)}
        />
      )}
    </div>
  );
};

export default CurriculumBuilder;
