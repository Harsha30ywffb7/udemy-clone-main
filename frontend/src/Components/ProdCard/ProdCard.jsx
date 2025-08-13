import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import "./prod.css";
import React from "react";
import { MultiItemCarousel } from "../MultiCarousel/MultiItemCarousel";
import { LightTooltip } from "../LandingPage/Landin";
import { PopperCard } from "./popperprodcard";
// export const PopperCard = React.forwardRef(function PopperCard(props, ref) {

export const ProdCard = React.forwardRef(function ProdCard(props, ref) {
  //  Spread the props to the underlying DOM element.
  console.log("props");
  const ratingValue = Number(props.data?.rating || 4.3);
  const ratingCount = props.data?.ratingCount || 1200;

  return (
    <Link
      style={{ height: "auto" }}
      className="prodLink"
      to={`/courses/${props.data?._id}`}
    >
      <div {...props} ref={ref} className="prodcard">
        <img className="prodimg" src={props.data.image} alt="" />
        <h3 className="card-title">{props.data?.title}</h3>
        <div className="author">{props.data?.author}</div>
        <div className="rating-div">
          <span className="rate-num">{ratingValue.toFixed(1)}</span>
          <Rating
            name="read-only"
            size="small"
            precision={0.5}
            value={ratingValue}
            readOnly
          />
          <span className="rate-count">({ratingCount.toLocaleString()})</span>
        </div>
        <div className="price-bar">
          <span className="price">Free</span>
        </div>
      </div>
    </Link>
  );
});

export const TechCard = () => {
  return (
    <div className="tec-cont">
      <div>
        <h2>Top categories</h2>
        <div className="categories-flex">
          <div className="tec-card">
            <img
              className="tec-img"
              src="https://s.udemycdn.com/home/top-categories/lohp-category-design-v2.jpg"
              alt=""
            />
            <span>Design</span>
          </div>
          <div className="tec-card">
            <img
              className="tec-img"
              src="https://s.udemycdn.com/home/top-categories/lohp-category-design-v2.jpg"
              alt=""
            />
            <span>Design</span>
          </div>
          <div className="tec-card">
            <img
              className="tec-img"
              src="https://s.udemycdn.com/home/top-categories/lohp-category-design-v2.jpg"
              alt=""
            />
            <span>Design</span>
          </div>
          <div className="tec-card">
            <img
              className="tec-img"
              src="https://s.udemycdn.com/home/top-categories/lohp-category-design-v2.jpg"
              alt=""
            />
            <span>Design</span>
          </div>
          <div className="tec-card">
            <img
              className="tec-img"
              src="https://s.udemycdn.com/home/top-categories/lohp-category-design-v2.jpg"
              alt=""
            />
            <span>Design</span>
          </div>
          <div className="tec-card">
            <img
              className="tec-img"
              src="https://s.udemycdn.com/home/top-categories/lohp-category-design-v2.jpg"
              alt=""
            />
            <span>Design</span>
          </div>
          <div className="tec-card">
            <img
              className="tec-img"
              src="https://s.udemycdn.com/home/top-categories/lohp-category-design-v2.jpg"
              alt=""
            />
            <span>Design</span>
          </div>
          <div className="tec-card">
            <img
              className="tec-img"
              src="https://s.udemycdn.com/home/top-categories/lohp-category-design-v2.jpg"
              alt=""
            />
            <span>Design</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SuggestionCard = ({ title, data, category }) => {
  let products = data.filter((el) => el.category === category);

  return (
    <div className="tec-cont">
      <div>
        <h2>{title}</h2>
        <MultiItemCarousel>
          {products.map((el) => (
            <LightTooltip
              key={el._id}
              arrow
              placement="right"
              title={<PopperCard data={el} />}
            >
              <ProdCard data={el} />
            </LightTooltip>
          ))}
        </MultiItemCarousel>
      </div>
    </div>
  );
};
