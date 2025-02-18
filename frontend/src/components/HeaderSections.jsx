import React, { useEffect } from 'react';
import { useGetTopProductsQuery, useGetFestivalProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import AOS from "aos";
import "aos/dist/aos.css";

const HeaderSections = () => {
    const {
        data: productsData,
        isLoading: productsLoading,
        error: productsError
    } = useGetTopProductsQuery();

    const {
        data: festivalData,
        isLoading: festivalLoading,
        error: festivalError
    } = useGetFestivalProductsQuery();

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "cubic-bezier(0.645, 0.045, 0.355, 1)",
            once: false,
            mirror: true,
            anchorPlacement: 'top-bottom',
        });
    }, []);
    // Show loader while data is loading
    if (productsLoading || festivalLoading) return <Loader />;

    // Show error message if any error occurs
    if (productsError || festivalError) {
        const errorMessage = productsError?.data?.message ||
            festivalError?.data?.message ||
            "Failed to load data";
        return <h1 className="text-center text-red-500 p-4">{errorMessage}</h1>;
    }

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

                {/* Product Slider */}
                <div
                    className="container mx-auto px-4 pb-8"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}

                        breakpoints={{
                            450: { slidesPerView: 2 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                        }}
                        className="py-8"
                    >
                        {productsData?.map((product, index) => (
                            <SwiperSlide key={product._id}>
                                <div
                                    className="w-full flex items-center justify-center transform transition-all duration-500 hover:scale-105"
                                    data-aos="zoom-in"
                                    data-aos-delay={index * 100}
                                >
                                    <SmallProduct product={product} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

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

                {/* Festival Product Slider */}
                <div
                    className="container mx-auto px-4 pb-8"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            450: { slidesPerView: 2 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                        }}
                        className="py-8"
                    >
                        {festivalData.products?.length > 0 ? (
                            festivalData.products.map((product, index) => (
                                <SwiperSlide key={product._id}>
                                    <div
                                        className="w-full flex items-center justify-center transform transition-all duration-500 hover:scale-105"
                                        data-aos="zoom-in"
                                        data-aos-delay={index * 100}
                                    >
                                        <SmallProduct product={product} />
                                    </div>
                                </SwiperSlide>
                            ))
                        ) : (
                            <div className="text-center p-4">
                                No festival products available
                            </div>
                        )}
                    </Swiper>
                </div>

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
        </div>
    );
};

export default HeaderSections;