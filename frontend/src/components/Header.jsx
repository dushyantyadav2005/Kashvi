import { useEffect } from "react";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import { useGetFestivalProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "motion/react";
import ProperButton from "./ProperButton";
import LocomotiveScroll from 'locomotive-scroll';
import HeaderSections from "./HeaderSections";
import { Link } from "react-router-dom";



const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();
  const { festivalData, festivalisLoading, festivalerror } = useGetTopProductsQuery();
  useEffect(() => {
    AOS.init({
      duration: 500, // Reduced animation duration from 1000 to 600
      easing: "ease-out",
      once: false, // Changed to false to allow animations on scroll
    });
  }, []);

  if (isLoading || festivalisLoading) {
    return <Loader />;
  }

  if (error || festivalerror) {
    return <h1>ERROR</h1>;
  }

  const locomotiveScroll = new LocomotiveScroll();


  return (
    <>
      <div className="relative ">
        {/* Quote Section with Parallax Effect */}
        <div
          className="w-full h-screen top-0 mt-16 flex items-center justify-center bg-cover bg-center bg-fixed relative shadow-sm shadow-black/20"
          style={{ backgroundImage: "url('/home.jpg')" }}
          data-aos="fade-up"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-[0.5]"></div>
          <div>
            <h2
              className="relative text-white text-xl max-sm:hidden max-md:text-5xl font-light text-center px-4 font-montserrat capitalize tracking-widest"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              YOUR SEARCH FOR SAREES ENDS HERE
            </h2>
            <h2
              className="relative text-white text-6xl max-sm:text-4xl max-md:text-5xl font-semibold text-center px-4 font-playfair uppercase"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              "Discover the Best,
              <br />
              Shop with Confidence"
            </h2>
            <div className="flex justify-center items-center mt-6">
              <Link to={"/shop"}>
                <ProperButton text="Shop Now" />
              </Link>
            </div>
          </div>
          {/* Quote Text */}


        </div>
        <HeaderSections />
      </div>
    </>
  );
};

export default Header;
