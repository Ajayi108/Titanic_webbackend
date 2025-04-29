import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ServiceSlider.css';
import { Autoplay } from 'swiper/modules';

const ServiceSlider = ({ services }) => {
  return (
    <div className="service-slider-container">
      <h2 className="section-title">Our Services</h2>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          }
        }}
        style={{padding: "0 60px"}}
      >
        {services.map((service, index) => (
          <SwiperSlide key={index}>
            <div className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ServiceSlider;