import React, { useReducer, useState, useEffect } from "react";
import Carousel from "./Carousel";
import LinkButton from "../../share/UIElements/LinkButton";
import {
  pythonData,
  js,
  excel,
  aws,
  dataScience,
} from "../data/course-selection-data/data";

const courseTabs = [
  { id: "Python", label: "Python", data: pythonData },
  { id: "JS", label: "JavaScript", data: js },
  { id: "Aws", label: "AWS Certification", data: aws },
  { id: "Excel", label: "Excel", data: excel },
  { id: "DataScience", label: "Data Science", data: dataScience },
];

const contentReducer = (state, action) => {
  switch (action.type) {
    case "Python":
      return {
        name: "Python",
        title: "Expand your career opportunities with Python",
        description:
          "Take one of Udemy’s range of Python courses and learn how to code using this incredibly useful language. Its simple syntax and readability makes Python perfect for Flask, Django, data science, and machine learning...",
      };
    case "JS":
      return {
        name: "JavaScript",
        title: "Grow your software development skills with JavaScript",
        description:
          "JavaScript is a text-based programming language used to make dynamic web pages. A must-learn for aspiring web developers or programmers...",
      };
    case "Aws":
      return {
        name: "AWS Certification",
        title: "Become an expert in cloud computing with AWS Certification",
        description:
          "Prep for your AWS certification with an AWS course on Udemy. Learn the fundamentals such as serverless platforms, frameworks, security, and more...",
      };
    case "Excel":
      return {
        name: "Excel",
        title: "Analyze and visualize data with Excel",
        description:
          "Take a Microsoft Excel course from Udemy and learn how to use this industry-standard software. From organizing data to advanced formulas...",
      };
    case "DataScience":
      return {
        name: "Data Science",
        title: "Lead data-driven decisions with Data Science",
        description:
          "Data science is in-demand in industries like finance, transport, education, manufacturing, and more. Learn Python, statistics, ML, and more...",
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export default function CourseSuggestions() {
  const [triggerElement, setTriggerElement] = useState("Python");
  const [state, dispatch] = useReducer(contentReducer, {
    name: "Python",
    title: "Expand your career opportunities with Python",
    description:
      "Take one of Udemy’s range of Python courses and learn how to code using this incredibly useful language...",
  });

  useEffect(() => {
    dispatch({ type: triggerElement });
  }, [triggerElement]);

  return (
    <div className="px-6">
      {/* Heading */}
      <h1 className="text-[1.4rem] font-extrabold mt-24 mb-2">
        A broad selection of courses
      </h1>
      <p className="text-[1rem] mb-4">
        Choose from 183,000 online video courses with new additions published
        every month
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        {courseTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTriggerElement(tab.id)}
            className={`text-[0.8rem] font-bold transition-colors ${
              triggerElement === tab.id ? "text-black" : "text-gray-500"
            } hover:text-black`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="border border-gray-300 p-6">
        <div className="flex flex-col gap-3 mb-6">
          <p className="text-[1.2rem] font-bold">{state.title}</p>
          <p className="text-[1rem] max-w-3xl">{state.description}</p>
          <LinkButton color="white" height="2.6rem" width="fit-content">
            Explore {state.name}
          </LinkButton>
        </div>

        {/* Carousel */}
        <div className="mt-4">
          {courseTabs.map(
            (tab) =>
              triggerElement === tab.id && (
                <Carousel key={tab.id} data={tab.data} />
              )
          )}
        </div>
      </div>
    </div>
  );
}
