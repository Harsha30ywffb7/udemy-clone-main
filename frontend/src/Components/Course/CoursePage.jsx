import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoSection from "./VideoSection";
import CurriculumList from "./CurriculumList";
import CourseHeader from "./CourseHeader";
import CourseMetaBlocks from "./CourseMetaBlocks";

import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ArticleIcon from "@mui/icons-material/Article";
import HelpIcon from "@mui/icons-material/Help";
import CodeIcon from "@mui/icons-material/Code";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
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
import {
  FALLBACK_MP4_URL,
  isYoutubeUrl,
  getContentIcon,
  formatDuration,
} from "./constants";
import { courseService } from "../../services/courseService";

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  

  // Course data
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);

  // Video player state
  const [currentVideo, setCurrentVideo] = useState(null);
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [currentSrc, setCurrentSrc] = useState("");
  const FALLBACK_SRC = FALLBACK_MP4_URL;

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

  // Keyboard shortcuts for video player
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isVideoMode) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          handlePlayPause();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
        case "Escape":
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isVideoMode, isFullscreen]);

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
      console.log("videoData", videoData);

      setCurrentVideo(videoData);
      setIsVideoMode(true);
      // don't auto-play to avoid browser autoplay blocks; show overlay instead
      setPlaying(false);
      setPlayed(0);
      const srcCandidate = content.video?.url || "";
      const chosen = isYoutubeUrl(srcCandidate)
        ? FALLBACK_MP4_URL
        : srcCandidate;
      setCurrentSrc(chosen);
      setVideoLoading(false);
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
    setVideoLoading(false);
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
    const next = !playing;
    setPlaying(next);
    setVideoLoading(next);
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
    if (state.playedSeconds && state.playedSeconds > 0) {
      setVideoLoading(false);
    }
    if (
      playerRef.current &&
      typeof playerRef.current.getDuration === "function"
    ) {
      const d = playerRef.current.getDuration();
      if (d && d !== duration) setDuration(d);
    }
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
              <VideoSection
                playerRef={playerRef}
                url={currentSrc || FALLBACK_SRC}
                playing={playing}
                volume={muted ? 0 : volume}
                onProgress={handleProgress}
                onEnded={() =>
                  markAsCompleted(
                    currentVideo.sectionIndex,
                    currentVideo.contentIndex
                  )
                }
                onError={(error) => {
                  console.error("Video playback error:", error);
                  setVideoLoading(false);
                }}
                onPlay={() => setVideoLoading(false)}
                style={{ position: "absolute", top: 0, left: 0 }}
              />

              {/* Loading Overlay */}
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                </div>
              )}

              {/* Click to Play Overlay */}
              {!playing && !videoLoading && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                  onClick={handlePlayPause}
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all duration-200">
                    <PlayArrowIcon className="text-white text-6xl" />
                  </div>
                </div>
              )}

              {/* Custom Controls Overlay */}
              {showControls && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar */}
                  <div
                    className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-4 hover:h-3 transition-all duration-200"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-200"
                      style={{ width: `${played * 100}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Keyboard shortcuts hint */}
                      <div className="text-xs text-gray-400 hidden md:block">
                        Space: Play/Pause • F: Fullscreen • M: Mute
                      </div>
                      {/* Play/Pause */}
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-purple-400 text-2xl transition-colors duration-200 hover:scale-110"
                      >
                        {playing ? <PauseIcon /> : <PlayArrowIcon />}
                      </button>

                      {/* Volume */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-purple-400 transition-colors duration-200 hover:scale-110"
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
                          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
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
                      <button className="text-white hover:text-purple-400 transition-colors duration-200 hover:scale-110">
                        <SettingsIcon />
                      </button>

                      {/* Fullscreen */}
                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-purple-400 transition-colors duration-200 hover:scale-110"
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
            <CurriculumList
              curriculum={curriculum}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              currentVideo={currentVideo}
              isContentCompleted={isContentCompleted}
              handleContentClick={handleContentClick}
            />
          </div>
        </div>
      </div>
    );
  }

  // Regular Course Page Layout
  return (
    <div className="bg-gray-900 min-h-screen">
      <CourseHeader course={course} />

      {/* Course Body */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              {/* What You'll Learn */}
              <div className="border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  What you'll learn from Course
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {course.learningObjectives?.map((objective, index) => (
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
                  {course.targetAudience?.map((audience, index) => (
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
