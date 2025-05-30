import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ServiceSlider.css';
import { reviews } from '../../data/reviews';   // Take the data stored in reviews.js file which contains reviews from users. 

const ServiceSlider = () => {
  return (
    <div className="service-slider-container">
      <h2 className="section-title">What Our Clients are saying: </h2>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        centeredSlides={true}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        style={{ padding: "0 60px" }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="review-card">
              {}
              <img 
                src={review.image} 
                alt={review.name} 
                className="review-avatar" 
              />
              <h3 className="review-name">  {review.name} </h3>
              <p className="review-profession">
                {review.profession}, {review.location}
              </p>
              <h4 className="review-title"> "{review.title}"</h4>
              <p className="review-description">"{review.description}"</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ServiceSlider;