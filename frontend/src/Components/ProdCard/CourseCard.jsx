import React from "react";
import { Star, StarHalf } from "@mui/icons-material";
import { Link } from "react-router-dom";

const CourseCard = ({ item }) => {
  console.log("item", item);
  const renderStars = () => {
    const fullStars = Math.floor(item.rateScore);
    const halfStar = item.rateScore % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            style={{ color: "#e59819", fontSize: "0.8rem" }}
          />
        ))}
        {halfStar && (
          <StarHalf style={{ color: "#e59819", fontSize: "0.8rem" }} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            style={{ color: "gray", fontSize: "0.8rem" }}
          />
        ))}
      </>
    );
  };

  return (
    <Link
      to={`/course/${item.id}`}
      className="block no-underline text-inherit hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex flex-col items-start max-w-[17.5rem] min-w-[10.3rem] text-[#1c1d1f] cursor-pointer">
        <div className="w-full">
          <img
            src={item.img}
            alt={item.title}
            className="block w-full h-full"
          />
        </div>

        <div className="w-full text-[1rem] font-normal leading-[1.4]">
          <h3 className="text-[1rem] h-[40px] overflow-hidden text-ellipsis whitespace-normal mt-[0.8rem] mb-[0.4rem] tracking-[-0.02rem] font-bold leading-[1.2]">
            {item.title}
          </h3>
          <div className="h-[18px] text-[0.8rem] leading-[1.4] mb-[0.4rem] overflow-hidden text-ellipsis whitespace-nowrap">
            {item.desc}
          </div>

          <div className="flex mb-[0.4rem] items-center">
            <span className="mr-[0.4rem] text-[#b4690e] font-bold leading-[1.2] tracking-[-0.02rem] text-[0.9rem]">
              {item.rateScore}
            </span>
            <div className="flex items-center">{renderStars()}</div>
            <span className="text-[#6a6f73] ml-[0.4rem] font-normal leading-[1.4] text-[0.8rem]">
              ({item.reviewerNum})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
