import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { courseService } from "../../services/courseService";
import "./VideoPlayer.css";

// Material-UI Icons
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LanguageIcon from "@mui/icons-material/Language";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import SettingsIcon from "@mui/icons-material/Settings";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ArticleIcon from "@mui/icons-material/Article";
import HelpIcon from "@mui/icons-material/Help";
import CodeIcon from "@mui/icons-material/Code";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import DescriptionIcon from "@mui/icons-material/Description";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Course data
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);

  // Video player state
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // UI state
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [completedContent, setCompletedContent] = useState(new Set());
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);

  // Load course data
  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);

      try {
        // Load course basic data
        const courseResponse = await courseService.getCourseBasic(id);
        if (courseResponse.success) {
          setCourse(courseResponse.data);
          setLoading(false);
        }

        // Load curriculum
        const curriculumResponse = await courseService.getCourseCurriculum(id);
        if (curriculumResponse.success) {
          setCurriculum(curriculumResponse.data);

          // Expand first section by default
          if (curriculumResponse.data.sections.length > 0) {
            setExpandedSections(new Set([0]));
          }
        }
      } catch (error) {
        console.error("ERROR LOADING COURSE DATA:", error);
      } finally {
        console.log("Finished loading, setting loading to false");
        setLoading(false);
      }
    };

    loadCourseData();
  }, [id]);

  // Content type to icon mapping
  const getContentIcon = (contentType) => {
    const iconMap = {
      video: VideoLibraryIcon,
      video_slide_mashup: SlideshowIcon,
      article: ArticleIcon,
      quiz: HelpIcon,
      coding_exercise: CodeIcon,
      assignment: AssignmentIcon,
      practice_test: HelpIcon,
      role_play: PlayCircleOutlineIcon,
      presentation: SlideshowIcon,
      document: DescriptionIcon,
    };
    return iconMap[contentType] || VideoLibraryIcon;
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle content click (video mode activation)
  const handleContentClick = (
    content,
    sectionIndex,
    contentIndex,
    sectionTitle
  ) => {
    if (content.contentType === "video" && content.video?.url) {
      const videoData = {
        ...content,
        sectionIndex,
        contentIndex,
        sectionTitle,
      };

      setCurrentVideo(videoData);
      setIsVideoMode(true);
      setPlaying(true);
      setPlayed(0);
    } else {
      alert(
        `${content.contentType.replace("_", " ").toUpperCase()}: ${
          content.title
        }\n\nThis content type will be implemented in future updates.`
      );
    }
  };

  // Exit video mode
  const exitVideoMode = () => {
    setIsVideoMode(false);
    setCurrentVideo(null);
    setPlaying(false);
    setPlayed(0);
  };

  // Toggle section expansion
  const toggleSection = (sectionIndex) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionIndex)) {
      newExpanded.delete(sectionIndex);
    } else {
      newExpanded.add(sectionIndex);
    }
    setExpandedSections(newExpanded);
  };

  // Video player event handlers
  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPlayed = clickX / rect.width;
    setPlayed(newPlayed);
    if (playerRef.current) {
      playerRef.current.seekTo(newPlayed);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Mark content as completed
  const markAsCompleted = (sectionIndex, contentIndex) => {
    const contentId = `${sectionIndex}-${contentIndex}`;
    const newCompleted = new Set(completedContent);
    newCompleted.add(contentId);
    setCompletedContent(newCompleted);
  };

  // Check if content is completed
  const isContentCompleted = (sectionIndex, contentIndex) => {
    const contentId = `${sectionIndex}-${contentIndex}`;
    return completedContent.has(contentId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!course || !curriculum) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <p className="text-gray-400">Unable to load course content.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Video Mode Layout
  if (isVideoMode && currentVideo) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Video Mode Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={exitVideoMode}
                className="text-gray-400 hover:text-white"
              >
                <ArrowBackIcon />
              </button>
              <div>
                <h1 className="text-lg font-semibold">{course.title}</h1>
                <p className="text-sm text-gray-400">
                  {currentVideo.sectionTitle} • {currentVideo.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                Progress: {Math.round(played * 100)}%
              </div>
              <button
                onClick={exitVideoMode}
                className="text-gray-400 hover:text-white"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Video Player Section */}
          <div className="flex-1 bg-black relative">
            <div className="relative w-full h-full">
              {/* React Player */}
              <ReactPlayer
                ref={playerRef}
                url={currentVideo.video.url}
                width="100%"
                height="100%"
                playing={playing}
                volume={muted ? 0 : volume}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onEnded={() =>
                  markAsCompleted(
                    currentVideo.sectionIndex,
                    currentVideo.contentIndex
                  )
                }
                controls={false}
                className="react-player"
              />

              {/* Custom Controls Overlay */}
              {showControls && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar */}
                  <div
                    className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-4"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${played * 100}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Play/Pause */}
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-purple-400 text-2xl"
                      >
                        {playing ? <PauseIcon /> : <PlayArrowIcon />}
                      </button>

                      {/* Volume */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-purple-400"
                        >
                          {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.1}
                          value={muted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none slider"
                        />
                      </div>

                      {/* Time */}
                      <div className="text-sm text-gray-300">
                        {formatDuration(played * duration)} /{" "}
                        {formatDuration(duration)}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Settings */}
                      <button className="text-white hover:text-purple-400">
                        <SettingsIcon />
                      </button>

                      {/* Fullscreen */}
                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-purple-400"
                      >
                        {isFullscreen ? (
                          <FullscreenExitIcon />
                        ) : (
                          <FullscreenIcon />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Title Overlay */}
              <div className="absolute top-4 left-4 bg-black/60 rounded-lg p-3">
                <h3 className="font-semibold">{currentVideo.title}</h3>
                <p className="text-sm text-gray-300">
                  {currentVideo.sectionTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Curriculum Sidebar */}
          <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold mb-2">Course Content</h2>
              <div className="text-sm text-gray-400">
                {curriculum.totalLectures} lectures •{" "}
                {formatDuration(curriculum.totalDuration)}
              </div>
            </div>

            {/* Sections List */}
            <div className="divide-y divide-gray-700">
              {curriculum.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-gray-800">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{section.title}</h3>
                      <p className="text-sm text-gray-400">
                        {section.content?.length || 0} lectures •{" "}
                        {formatDuration(
                          section.content?.reduce(
                            (total, content) => total + (content.duration || 0),
                            0
                          ) || 0
                        )}
                      </p>
                    </div>
                    {expandedSections.has(sectionIndex) ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </button>

                  {/* Section Content */}
                  {expandedSections.has(sectionIndex) && (
                    <div className="bg-gray-750">
                      {section.content?.map((content, contentIndex) => {
                        const IconComponent = getContentIcon(
                          content.contentType
                        );
                        const isCompleted = isContentCompleted(
                          sectionIndex,
                          contentIndex
                        );
                        const isCurrent =
                          currentVideo &&
                          currentVideo.sectionIndex === sectionIndex &&
                          currentVideo.contentIndex === contentIndex;

                        return (
                          <button
                            key={contentIndex}
                            onClick={() =>
                              handleContentClick(
                                content,
                                sectionIndex,
                                contentIndex,
                                section.title
                              )
                            }
                            className={`w-full px-6 py-3 text-left hover:bg-gray-600 flex items-center gap-3 border-l-4 ${
                              isCurrent
                                ? "border-purple-500 bg-gray-700"
                                : "border-transparent"
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircleIcon
                                  className="text-green-500"
                                  style={{ fontSize: 20 }}
                                />
                              ) : (
                                <IconComponent
                                  className={
                                    content.contentType === "video"
                                      ? "text-blue-400"
                                      : "text-gray-400"
                                  }
                                  style={{ fontSize: 20 }}
                                />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-medium truncate ${
                                  isCurrent ? "text-purple-300" : "text-white"
                                }`}
                              >
                                {content.title}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="capitalize">
                                  {content.contentType.replace("_", " ")}
                                </span>
                                {content.duration > 0 && (
                                  <>
                                    <span>•</span>
                                    <AccessTimeIcon style={{ fontSize: 12 }} />
                                    <span>
                                      {formatDuration(content.duration)}
                                    </span>
                                  </>
                                )}
                                {content.isPreview && (
                                  <>
                                    <span>•</span>
                                    <span className="text-green-400">
                                      Preview
                                    </span>
                                  </>
                                )}
                                {content.isFree && (
                                  <>
                                    <span>•</span>
                                    <span className="text-blue-400">Free</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular Course Page Layout
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Course Header */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Left Content */}
            <div className="flex-1">
              {/* Course Title */}
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

              {/* Course Headline */}
              <p className="text-lg text-gray-300 mb-6">{course.headline}</p>

              {/* Course Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold">
                    {course.rating || 4.5}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className="text-yellow-400 text-sm"
                      />
                    ))}
                  </div>
                  <span className="text-purple-300">
                    ({course.total_ratings?.toLocaleString() || "0"} ratings)
                  </span>
                </div>
                <div className="text-gray-300">
                  {course.total_students?.toLocaleString() || "0"} students
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-gray-300">Created by</span>
                <span className="text-purple-300 font-semibold">
                  {course.visible_instructors
                    ?.map((instructor) => instructor.title || instructor.name)
                    .join(", ") || "Instructor"}
                </span>
              </div>

              {/* Course Details */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <AccessTimeIcon className="text-xs" />
                  <span>
                    Last updated {course.last_update_date || "Recently"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <LanguageIcon className="text-xs" />
                  <span>{course.language || "English"}</span>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Course Card */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Course Thumbnail */}
                <div className="relative">
                  <img
                    src={course.thumbnailUrl || course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/320x180/6366f1/ffffff?text=${encodeURIComponent(
                        course.title.substring(0, 20)
                      )}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <button className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all">
                      <PlayCircleOutlineIcon className="text-gray-800 text-4xl" />
                    </button>
                  </div>
                </div>

                {/* Course Actions */}
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      FREE
                    </div>
                  </div>

                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium mb-3">
                    Enroll for Free
                  </button>

                  <div className="text-center text-sm text-gray-600">
                    30-Day Money-Back Guarantee
                  </div>

                  {/* Course Features */}
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <AccessTimeIcon className="text-gray-500 text-xs" />
                      <span>
                        {formatDuration(curriculum?.totalDuration || 0)}{" "}
                        on-demand video
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArticleIcon className="text-gray-500 text-xs" />
                      <span>{curriculum?.totalLectures || 0} articles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="text-gray-500 text-xs" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="text-gray-500 text-xs" />
                      <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="text-gray-500 text-xs" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Body */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              {/* What You'll Learn */}
              <div className="border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                <div className="grid grid-cols-2 gap-4">
                  {course.learning_objectives?.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="text-gray-700 text-sm flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{objective}</span>
                    </div>
                  )) || (
                    <div className="col-span-2 text-gray-500">
                      Learning objectives not available
                    </div>
                  )}
                </div>
              </div>

              {/* Course Content */}
              <div className="border border-gray-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Course content</h2>
                  <div className="text-sm text-gray-600">
                    {curriculum?.totalLectures || 0} lectures •{" "}
                    {formatDuration(curriculum?.totalDuration || 0)}
                  </div>
                </div>

                {/* Sections List */}
                <div className="space-y-2">
                  {curriculum?.sections?.map((section, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      className="border border-gray-200 rounded"
                    >
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(sectionIndex)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div>
                          <h3 className="font-semibold">{section.title}</h3>
                          <p className="text-sm text-gray-600">
                            {section.content?.length || 0} lectures •{" "}
                            {formatDuration(
                              section.content?.reduce(
                                (total, content) =>
                                  total + (content.duration || 0),
                                0
                              ) || 0
                            )}
                          </p>
                        </div>
                        {expandedSections.has(sectionIndex) ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </button>

                      {/* Section Content */}
                      {expandedSections.has(sectionIndex) && (
                        <div className="border-t border-gray-200 bg-gray-50">
                          {section.content?.map((content, contentIndex) => {
                            const IconComponent = getContentIcon(
                              content.contentType
                            );

                            return (
                              <button
                                key={contentIndex}
                                onClick={() =>
                                  handleContentClick(
                                    content,
                                    sectionIndex,
                                    contentIndex,
                                    section.title
                                  )
                                }
                                className="w-full px-6 py-3 text-left hover:bg-gray-100 flex items-center gap-3 border-b border-gray-200 last:border-b-0"
                              >
                                <IconComponent
                                  className={
                                    content.contentType === "video"
                                      ? "text-blue-600"
                                      : "text-gray-600"
                                  }
                                  style={{ fontSize: 20 }}
                                />

                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {content.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="capitalize">
                                      {content.contentType.replace("_", " ")}
                                    </span>
                                    {content.duration > 0 && (
                                      <>
                                        <span>•</span>
                                        <span>
                                          {formatDuration(content.duration)}
                                        </span>
                                      </>
                                    )}
                                    {content.isPreview && (
                                      <>
                                        <span>•</span>
                                        <span className="text-green-600">
                                          Preview
                                        </span>
                                      </>
                                    )}
                                    {content.isFree && (
                                      <>
                                        <span>•</span>
                                        <span className="text-blue-600">
                                          Free
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {content.contentType === "video" && (
                                  <PlayCircleOutlineIcon className="text-purple-600" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements?.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">
                        {requirement}
                      </span>
                    </li>
                  )) || (
                    <li className="text-gray-500">No specific requirements</li>
                  )}
                </ul>
              </div>

              {/* Description */}
              <div className="border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Description</h2>
                <div
                  className={`${
                    !isDescriptionExpanded ? "max-h-96 overflow-hidden" : ""
                  }`}
                >
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {course.description || "Course description not available."}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="text-purple-600 font-bold text-sm mt-4 flex items-center gap-1 hover:bg-purple-50 px-2 py-1 rounded"
                >
                  <span>
                    {isDescriptionExpanded ? "Show Less" : "Show More"}
                  </span>
                  {isDescriptionExpanded ? (
                    <KeyboardArrowUpIcon className="text-xs" />
                  ) : (
                    <KeyboardArrowDownIcon className="text-xs" />
                  )}
                </button>
              </div>

              {/* Who this course is for */}
              <div className="border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  Who this course is for
                </h2>
                <ul className="space-y-2">
                  {course.target_audience?.map((audience, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{audience}</span>
                    </li>
                  )) || (
                    <li className="text-gray-500">
                      Target audience not specified
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 flex-shrink-0">
              {/* Sticky sidebar content can go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
