import React from "react";

const categories = [
  {
    title: "Design",
    img: "/images/top-categories/lohp-category-design-2x-v2.jpeg",
  },
  {
    title: "Development",
    img: "/images/top-categories/lohp-category-development-2x-v2.jpeg",
  },
  {
    title: "Marketing",
    img: "/images/top-categories/lohp-category-marketing-2x-v2.jpeg",
  },
  {
    title: "IT and Software",
    img: "/images/top-categories/lohp-category-it-and-software-2x-v2.jpeg",
  },
  {
    title: "Personal Development",
    img: "/images/top-categories/lohp-category-personal-development-2x-v2.jpeg",
  },
  {
    title: "Business",
    img: "/images/top-categories/lohp-category-business-2x-v2.jpeg",
  },
  {
    title: "Photography",
    img: "/images/top-categories/lohp-category-photography-2x-v2.jpeg",
  },
  {
    title: "Music",
    img: "/images/top-categories/lohp-category-music-2x-v2.jpeg",
  },
];

const TopCategories = () => {
  return (
    <div className="text-custom-black font-normal leading-[1.4] text-base mt-[3.2rem]">
      <section className="max-w-[134rem] mx-auto px-[2.4rem]">
        <h2 className="text-xl font-bold leading-[1.4] tracking-[0.02rem] mb-[3rem]">
          Top categories
        </h2>
        <div className="flex flex-wrap -mx-[1rem] justify-center -mb-[3.2rem]">
          {categories.map((category, index) => (
            <a
              key={index}
              href="#"
              className="block mx-[1rem] mb-[1.6rem] max-w-[calc(100%/5-1rem)] cursor-pointer"
            >
              <div className="overflow-hidden ">
                <img
                  src={category.img}
                  className="bg-custom-bg block object-contain transition-transform duration-100 ease-[cubic-bezier(0.2,0,1,0.9)] max-w-full h-auto hover:scale-108"
                  alt={category.title}
                />
              </div>
              <div className="pt-[0.8rem] pb-[1.6rem]">
                <span className="font-bold leading-[1.2] text-base tracking-[-0.02rem]">
                  {category.title}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TopCategories;
