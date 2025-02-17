import React, { useEffect } from 'react';
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

const HeaderSections = () => {
    const { data, isLoading, error } = useGetTopProductsQuery();

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "cubic-bezier(0.645, 0.045, 0.355, 1)",
            once: false,
            mirror: true,
            anchorPlacement: 'top-bottom',
        });
    }, []);

    if (isLoading) return <Loader />;
    if (error) return <h1>ERROR</h1>;

    const renderProductSlider = (products) => (
        <div className="container relative mx-auto px-4 pb-8" data-aos="fade-up" data-aos-duration="1000">
            {/* Custom Navigation Buttons with SVG */}
            <button className="custom-swiper-button-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#d1a515" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </button>
            <button className="custom-swiper-button-next absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#d1a515" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>

            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={{
                    prevEl: '.custom-swiper-button-prev',
                    nextEl: '.custom-swiper-button-next',
                }}
                pagination={{
                    clickable: true,
                    type: 'bullets',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                    bulletClass: 'swiper-pagination-bullet',
                }}
                speed={800}
                breakpoints={{
                    450: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                className="py-8 px-12"
            >
                {products.map((product, index) => (
                    <SwiperSlide key={product._id}>
                        <div 
                            className="group relative w-full flex items-center justify-center"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="w-full transform transition-all duration-500 hover:scale-[1.02] relative">
                                <div className="absolute inset-0 bg-[#d1a515]/0 group-hover:bg-[#d1a515]/5 transition-colors duration-300 rounded-lg"></div>
                                <SmallProduct product={product} />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );

    return (
        <div id="sections" className="overflow-hidden">
            {/* Top Embellishment */}
            <div className="relative">
                <img 
                    src="../../images/embupsidedown.png" 
                    alt="Decorative Embellishment" 
                    className="w-full h-auto opacity-50 transform transition-transform duration-1000 hover:scale-105" 
                    data-aos="fade-down"
                    data-aos-duration="1500"
                    data-aos-offset="200"
                />
            </div>

            {/* Best Sellers Section */}
            <div id="best-sellersection">
                <div className="flex items-center flex-col justify-center my-7 relative">
                    <img 
                        src="../../images/doubleup.png" 
                        alt="Double Up Decoration" 
                        className="w-1/12 h-auto mb-5 transform transition-all duration-700 hover:rotate-180" 
                        data-aos="zoom-in"
                        data-aos-duration="800"
                    />
                    
                    <div className="relative">
                        <h2 
                            className="text-center font-semibold text-4xl mx-4 mb-2 font-playfair uppercase bg-gradient-to-r from-[#d1a515] via-[#e3af03] to-[#d1a515] text-transparent bg-clip-text hover:from-[#e3af03] hover:to-[#d1a515] transition-all duration-500" 
                            data-aos="fade-up"
                            data-aos-delay="200"
                            data-aos-duration="1000"
                        >
                            Best Sellers
                        </h2>
                        <h2
                            className="relative text-black text-base max-md:text-4xl font-light text-center px-4 font-montserrat uppercase tracking-widest"
                            data-aos="fade-up"
                            data-aos-delay="400"
                            data-aos-duration="1000"
                        >
                            BEST SELLING SAREES
                        </h2>
                    </div>

                    <img 
                        src="../../images/doubledown.png" 
                        alt="Double Down Decoration" 
                        className="w-1/12 h-auto mt-5 transform transition-all duration-700 hover:-rotate-180" 
                        data-aos="zoom-in"
                        data-aos-duration="800"
                    />
                </div>

                {renderProductSlider(data)}

                <div className="w-full flex justify-center my-8">
                    <div 
                        className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#24110c]/20 to-transparent"
                        data-aos="fade-right"
                        data-aos-duration="1200"
                    />
                </div>
            </div>

            {/* Festival Section */}
            <div id="festival-section" className="mt-16">
                <div className="flex items-center flex-col justify-center my-7">
                    <img 
                        src="../../images/doubleup.png" 
                        alt="Double Up Decoration" 
                        className="w-1/12 h-auto mb-5 transform transition-all duration-700 hover:rotate-180" 
                        data-aos="zoom-in"
                        data-aos-duration="800"
                    />
                    
                    <h2 
                        className="text-center font-semibold text-4xl mx-4 mb-2 font-playfair uppercase bg-gradient-to-r from-[#d1a515] via-[#e3af03] to-[#d1a515] text-transparent bg-clip-text hover:from-[#e3af03] hover:to-[#d1a515] transition-all duration-500" 
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        Festival Sarees
                    </h2>
                    <h2
                        className="relative text-black text-base max-md:text-4xl font-light text-center px-4 font-montserrat uppercase tracking-widest"
                        data-aos="fade-up"
                        data-aos-delay="400"
                    >
                        Sarees for all festivals
                    </h2>
                    
                    <img 
                        src="../../images/doubledown.png" 
                        alt="Double Down Decoration" 
                        className="w-1/12 h-auto mt-5 transform transition-all duration-700 hover:-rotate-180" 
                        data-aos="zoom-in"
                        data-aos-duration="800"
                    />
                </div>

                {renderProductSlider(data)}

                <div className="relative">
                    <img 
                        src="../../images/embupsidedown.png" 
                        alt="Decorative Embellishment" 
                        className="w-full h-auto opacity-50 rotate-180 transform transition-transform duration-1000 hover:scale-105" 
                        data-aos="fade-up"
                        data-aos-duration="1500"
                    />
                </div>
            </div>

            <style jsx>{`
                .swiper-pagination {
                    position: relative;
                    margin-top: 20px;
                }
                
                .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background: #d1a515;
                    opacity: 0.3;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    margin: 0 6px;
                }
                
                .swiper-pagination-bullet-active {
                    opacity: 1;
                    width: 24px;
                    border-radius: 4px;
                    background: linear-gradient(to right, #d1a515, #e3af03);
                }

                .swiper-slide {
                    transition: all 0.4s ease;
                }

                .swiper-slide-active {
                    opacity: 1;
                }

                .custom-swiper-button-prev,
                .custom-swiper-button-next {
                    border: 1px solid rgba(209, 165, 21, 0.2);
                }

                .custom-swiper-button-prev:hover,
                .custom-swiper-button-next:hover {
                    border-color: rgba(209, 165, 21, 0.4);
                }

                .custom-swiper-button-prev.swiper-button-disabled,
                .custom-swiper-button-next.swiper-button-disabled {
                    opacity: 0;
                    cursor: default;
                }

                @media (max-width: 640px) {
                    .custom-swiper-button-prev,
                    .custom-swiper-button-next {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default HeaderSections;