import React from 'react'
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
import {motion} from "motion/react";
import ProperButton from "./ProperButton";
import LocomotiveScroll from 'locomotive-scroll';

const HeaderSections = () => {


    const { data, isLoading, error } = useGetTopProductsQuery();

    useEffect(() => {
      AOS.init({
        duration: 600, // Reduced animation duration from 1000 to 600
        easing: "ease-out",
        once: false, // Changed to false to allow animations on scroll
      });
    }, []);
  
    if (isLoading) {
      return <Loader />;
    }
  
    if (error) {
      return <h1>ERROR</h1>;
    }
  
    const locomotiveScroll = new LocomotiveScroll();
  


  return (
    <div id="sections">
        {/* Product Carousel */}
        <img src="../../images/embupsidedown.png" alt="" className='w-full h-auto opacity-50' />
        <div id="best-sellersection">
        <div className='flex items-center flex-col justify-center my-7'>
        <img src="../../images/doubleup.png" alt="" className='w-1/12 h-auto mb-5' />
            
            <h2 className="text-center font-semibold text-4xl mx-4 mb-2 font-playfair uppercase bg-gradient-to-r from-[#d1a515] via-[#e3af03] to-[#d1a515] text-transparent bg-clip-text border-radius-full" data-aos="fade-up" data-aos-delay="300">

            Best Sellers
            </h2>
            <h2
            className="relative text-black text-base max-md:text-4xl font-light text-center px-4 font-montserrat uppercase tracking-widest"
            data-aos="fade-up"
            data-aos-delay="300"
            >
            BEST SELLING SAREES
            </h2>
        <img src="../../images/doubledown.png" alt="" className='w-1/12 h-auto mt-5' />

        </div>
        


        {/* Small Product Grid as a Slider */}
        <div className="container mx-auto px-4 pb-8">
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
                  data-aos-delay={index * 100} // Reduced delay between items
                >
                  <SmallProduct product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <div className="w-full flex justify-center my-8">
          <div className="w-5/6 h-[1px] bg-[#24110c]/10"></div>
        </div>
        </div>
        <div id="festival-section">
        <div className='flex items-center flex-col justify-center my-7'>
        <img src="../../images/doubleup.png" alt="" className='w-1/12 h-auto mb-5' />
            
            <h2 className="text-center font-semibold text-4xl mx-4 mb-2 font-playfair uppercase bg-gradient-to-r from-[#d1a515] via-[#e3af03] to-[#d1a515] text-transparent bg-clip-text border-radius-full" data-aos="fade-up" data-aos-delay="300">

            Festival Sarees
            </h2>
            <h2
            className="relative text-black text-base max-md:text-4xl font-light text-center px-4 font-montserrat uppercase tracking-widest"
            data-aos="fade-up"
            data-aos-delay="300"
            >
            Sarees for all festivals
            </h2>
        <img src="../../images/doubledown.png" alt="" className='w-1/12 h-auto mt-5' />

        </div>
        
          {/* Small Product Grid as a Slider */}
          <div className="container mx-auto px-4 pb-8">
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
                    data-aos-anchor="#festival-section"
                    data-aos-delay={index * 100} // Reduced delay between items
                  >
                    <SmallProduct product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        <img src="../../images/embupsidedown.png" alt="" className='w-full h-auto opacity-50 rotate-180' />

        </div>
        </div>
  )
}

export default HeaderSections