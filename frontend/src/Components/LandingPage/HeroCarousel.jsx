import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./HeroCarousel.css";

const HeroCarousel = () => {
  const { user } = useSelector((store) => store.auth);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Only show carousel for logged-in users
  if (!user?.user) {
    return null;
  }

  const carouselData = [
    {
      id: 1,
      image: "/images/heroCoroursal/hero-1.png",
      title: "Share the gift of learning",
      subtitle:
        "Save 20% on a year of unlimited access to 26K+ top courses for you and a friend. Terms apply.",
      cta: "Share now",
      link: "/",
      highlightText: "Terms apply.",
    },
    {
      id: 2,
      image: "/images/heroCoroursal/hero-2.png",
      title: "Learn in-demand skills",
      subtitle: "Build expertise with courses from world-class instructors",
      cta: "Explore courses",
      link: "/",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselData.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselData.length) % carouselData.length
    );
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const fullName = user?.user?.fullName || "User";

  return (
    <div className="hero-carousel">
      {/* Personalized Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-avatar">
          <div className="avatar-circle">
            {fullName.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome back, {fullName}</h1>
          <button
            className="welcome-link"
            onClick={() => navigate("/profile")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Add occupation and interests
          </button>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="carousel-container">
        <div
          className="carousel-slides"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselData.map((slide, index) => (
            <div key={slide.id} className="carousel-slide">
              <div className="slide-content">
                <div className="slide-text">
                  <h1 className="slide-title">{slide.title}</h1>
                  <p className="slide-subtitle">
                    {slide.subtitle}
                    {slide.highlightText && (
                      <span className="highlight-text">
                        {" "}
                        {slide.highlightText}
                      </span>
                    )}
                  </p>
                  <button className="slide-cta">{slide.cta}</button>
                </div>
                <div className="slide-image">
                  <img src={slide.image} alt={slide.title} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={goToPrevious}
        >
          ‹
        </button>
        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={goToNext}
        >
          ›
        </button>

        {/* Dots indicator */}
        <div className="carousel-dots">
          {carouselData.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${
                index === currentSlide ? "active" : ""
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Let's start learning section for logged-in users */}
      <div className="learning-section">
        <div className="learning-header">
          <h2 className="learning-title">Let's start learning</h2>
          <button
            className="learning-link"
            onClick={() => navigate("/my-learning")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            My learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
