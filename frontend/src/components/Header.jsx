import { useEffect } from "react";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import AOS from "aos";
import "aos/dist/aos.css";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      easing: "ease-out", // Animation easing
      once: true, // Ensures animation happens only once
    });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="relative">
        {/* Quote Section with Parallax Effect */}
        <div
          className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-fixed relative"
          style={{ backgroundImage: "url('../../public/karwa_chauth_sarees_3024x.webp')" }}
          data-aos="fade-up"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-[0.2]"></div>

          {/* Quote Text */}
          <h2
            className="relative text-white text-3xl md:text-5xl font-bold text-center px-4"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            "Discover the Best, Shop with Confidence"
          </h2>
        </div>

        {/* Product Carousel */}
        <h2 className="text-center font-semibold text-5xl m-4" data-aos="fade-up" data-aos-delay="800">
          Best Sellers
        </h2>

        {/* Small Product Grid as a Slider */}
        <div className="container mx-auto px-4 py-8">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={15}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              450: { slidesPerView: 2 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
          >
            {data.map((product, index) => (
              <SwiperSlide key={product._id}>
                <div
                  className="w-full flex items-center justify-center"
                  data-aos="fade-up"
                  data-aos-delay={index * 200} // Delays each product's animation
                >
                  <SmallProduct product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Header;
