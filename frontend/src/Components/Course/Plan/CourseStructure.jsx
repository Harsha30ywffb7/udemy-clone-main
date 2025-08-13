import React from "react";
import "./CourseStructure.css";

const CourseStructure = () => {
  // Requirements Section
  const courseRequirements = [
    {
      id: 1,
      text: "See the",
      linkText: "complete list",
      linkUrl: "/course-quality-requirements",
      afterText: "of course quality requirements",
    },
    {
      id: 2,
      text: "Your course must have at least five lectures",
    },
    {
      id: 3,
      text: "All lectures must add up to at least 30+ minutes of total video",
    },
    {
      id: 4,
      text: "Your course is composed of valuable educational content and free of promotional or distracting materials",
    },
  ];

  // Resources Section
  const courseResources = [
    {
      id: 1,
      title: "Udemy Trust & Safety",
      description: "Our policies for instructors and students",
      linkUrl: "/trust-safety",
      linkColor: "#5624d0",
    },
    {
      id: 2,
      title: "Join the instructor community",
      description: "A place to connect with other instructors",
      linkUrl: "/instructor-community",
      linkColor: "#5624d0",
    },
    {
      id: 3,
      title: "Official Udemy Course: How to Create an Online Course",
      description:
        "Learn about course creation from the Udemy Instructor Team and experienced instructors",
      linkUrl: "/how-to-create-course",
      linkColor: "#5624d0",
    },
  ];

  // Tips Section
  const courseTips = [
    {
      id: 1,
      title: "Start with your goals.",
      content: [
        {
          type: "text",
          text: "Setting goals for what learners will accomplish in your course (also known as",
        },
        {
          type: "link",
          text: "learning objectives",
          url: "/learning-objectives",
        },
        {
          type: "text",
          text: ") at the beginning will help you determine what content to include in your course and how you will teach the content to help your learners achieve the goals.",
        },
      ],
    },
    {
      id: 2,
      title: "Create an outline.",
      content: [
        {
          type: "text",
          text: "Decide what skills you'll teach and how you'll teach them. Group related lectures into sections. Each section should have at least 3 lectures, and include at least one assignment or practical activity.",
        },
        {
          type: "link",
          text: "Learn more.",
          url: "/course-outline-guide",
        },
      ],
    },
    {
      id: 3,
      title: "Introduce yourself and create momentum.",
      content: [
        {
          type: "text",
          text: "People online want to start learning quickly. Make an introduction section that gives learners something to be excited about in the first 10 minutes.",
        },
      ],
    },
    {
      id: 4,
      title: "Sections have a clear learning objective.",
      content: [
        {
          type: "text",
          text: "Introduce each section by describing the section's",
        },
        {
          type: "link",
          text: "goal and why it's important",
          url: "/section-objectives",
        },
        {
          type: "text",
          text: ". Give lectures and sections titles that reflect their content and have a logical flow.",
        },
      ],
    },
    {
      id: 5,
      title: "Lectures cover one concept.",
      content: [
        {
          type: "text",
          text: "A good lecture length is 2-7 minutes to keep students interested and help them study in short bursts. Cover a single topic in each lecture so learners can easily find and re-watch them later.",
        },
      ],
    },
    {
      id: 6,
      title: "Mix and match your lecture types.",
      content: [
        {
          type: "text",
          text: "Alternate between filming yourself, your screen, and slides or other visuals. Showing yourself can help learners feel connected.",
        },
      ],
    },
    {
      id: 7,
      title: "Practice activities create hands-on learning.",
      content: [
        {
          type: "text",
          text: "Help learners",
        },
        {
          type: "link",
          text: "apply your lessons",
          url: "/practice-activities",
        },
        {
          type: "text",
          text: "to their real world with projects, assignments, coding exercises, or worksheets.",
        },
      ],
    },
  ];
  return (
    <div className="course-structure">
      <div className="title">Course structure</div>
    </div>
  );
};

export default CourseStructure;
