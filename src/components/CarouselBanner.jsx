import Carousel from "react-bootstrap/Carousel";
import "./CarouselBanner.css";

function CarouselBanner() {
  return (
    <Carousel fade controls={false} indicators={false} interval={3000} className="login_carousel_container">
      <Carousel.Item>
        <div className="picture_container">
          <div className="pic_div"></div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="picture_container">
          <div className="pic_div1"></div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselBanner;
