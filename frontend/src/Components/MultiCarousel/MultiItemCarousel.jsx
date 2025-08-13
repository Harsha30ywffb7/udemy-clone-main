import Slider from "react-slick";
import "./carousel.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ProdCard } from "../ProdCard/ProdCard";
// import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
const PreviousBtn = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <ArrowBackIosNewIcon style={{ color: "white", fontSize: "25px" }} />
    </div>
  );
};
const NextBtn = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <ArrowForwardIosIcon style={{ color: "white", fontSize: "25px" }} />
    </div>
  );
};

const carouselProperties = {
  prevArrow: <PreviousBtn />,
  nextArrow: <NextBtn />,
  slidesToShow: 4,
  slidesToScroll: 1,
  infinite: false,
  centerMode: false,
  centerPadding: "0px",
  dots: false,
  arrows: true,
  responsive: [
    {
      breakpoint: 426,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
      },
    },
    {
      breakpoint: 769,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: false,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: false,
      },
    },
    {
      breakpoint: 1500,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: false,
      },
    },
    {
      breakpoint: 1900,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: false,
      },
    },
  ],
};

export const MultiItemCarousel = ({ children }) => {
  return (
    <div className="carousel">
      <Slider {...carouselProperties}>{children}</Slider>
    </div>
  );
};
