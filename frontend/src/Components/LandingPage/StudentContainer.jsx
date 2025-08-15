import React, { useState } from "react";
import { courses, sugestedCourses } from "../data/student-viewing-data/data";
import CourseCard from "../ProdCard/CourseCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import ItemsCarousel from "react-items-carousel";

const Arrow = ({ direction, children }) => (
  <div
    className={`w-[4.8rem] h-[4.8rem] bg-black border border-[#6a6f73] rounded-full flex justify-center items-center absolute top-[15%] ${
      direction === "right" ? "right-[-1.6rem]" : "left-[-1.6rem]"
    } m-auto cursor-pointer z-[2] hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)]`}
  >
    {children}
  </div>
);

const CoursesSection = ({
  title,
  highlight,
  data,
  activeIndex,
  setActiveIndex,
}) => {
  const chevronWidth = 50;

  return (
    <div className="mt-[4.8rem] hover:cursor-pointer">
      <h2 className="mb-[1.6rem] max-w-[80rem] font-bold text-[1.5rem] tracking-[0.02rem] leading-[1.2]">
        {title}{" "}
        {highlight && <span className="text-purple-700">"{highlight}"</span>}
      </h2>

      <div className="relative">
        <ItemsCarousel
          requestToChangeActive={setActiveIndex}
          activeItemIndex={activeIndex}
          numberOfCards={5}
          gutter={15}
          leftChevron={
            <Arrow direction="left">
              <FontAwesomeIcon
                style={{ color: "white", fontSize: "2rem" }}
                icon={faAngleLeft}
              />
            </Arrow>
          }
          rightChevron={
            <Arrow direction="right">
              <FontAwesomeIcon
                style={{ color: "white", fontSize: "2rem" }}
                icon={faAngleRight}
              />
            </Arrow>
          }
          outsideChevron={false}
          chevronWidth={chevronWidth}
        >
          {data.map((item) => (
            <CourseCard item={item} key={item.id} />
          ))}
        </ItemsCarousel>
      </div>
    </div>
  );
};

const StudentContainer = () => {
  const [activeItemIndex1, setActiveItemIndex1] = useState(0);
  const [activeItemIndex2, setActiveItemIndex2] = useState(0);

  return (
    <div className="mt-[6.4rem] px-[2.4rem]">
      <CoursesSection
        title="Students Viewing"
        data={courses}
        activeIndex={activeItemIndex1}
        setActiveIndex={setActiveItemIndex1}
      />

      <CoursesSection
        title="Because you searched for"
        highlight="zero to master"
        data={sugestedCourses}
        activeIndex={activeItemIndex2}
        setActiveIndex={setActiveItemIndex2}
      />
    </div>
  );
};

export default StudentContainer;
