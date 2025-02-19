import { useEffect, useRef } from "react";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import AOS from "aos";
import "aos/dist/aos.css";
import ProperButton from "./ProperButton";
import HeaderSections from "./HeaderSections";
import { Link } from "react-router-dom";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();
  const parallaxRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out",
      once: false,
    });

    const handleScroll = () => {
      const scrollTop = window.scrollY;

      // Parallax effect for the background layer
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrollTop * 0.3}px) scale(${1 + scrollTop * 0.0005
          })`;
      }

      // Parallax effect for the midground layer
      if (layer1Ref.current) {
        layer1Ref.current.style.transform = `translateY(${scrollTop * 0.5}px) scale(${1 + scrollTop * 0.0003
          })`;
        layer1Ref.current.style.opacity = `${1 - scrollTop / 1000}`;
      }

      // Parallax effect for the foreground layer
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translateY(${scrollTop * 0.7}px) scale(${1 + scrollTop * 0.0002
          })`;
      }
    };

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const moveX = (clientX - centerX) * 0.02;
      const moveY = (clientY - centerY) * 0.02;

      // Mouse parallax effect for the midground layer
      if (layer1Ref.current) {
        layer1Ref.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }

      // Mouse parallax effect for the foreground layer
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translate(${moveX * 1.5}px, ${moveY * 1.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <h1>ERROR</h1>;

  return (
    <div className="relative">
      {/* Parallax Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Layer (Slowest) */}
        <div
          ref={parallaxRef}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
          style={{ backgroundImage: "url('/home.jpg')" }}
        ></div>

        {/* Midground Layer */}
        <div
          ref={layer1Ref}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out opacity-90"
          style={{ backgroundImage: "url('/layer1.png')" }} // Add a transparent PNG overlay
        ></div>

        {/* Foreground Layer (Fastest) */}
        <div
          ref={layer2Ref}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
          style={{ backgroundImage: "url('/layer2.png')" }} // Another overlay for extra depth
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h2
            className="text-xl max-sm:hidden max-md:text-5xl font-light font-montserrat capitalize tracking-widest"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            YOUR SEARCH FOR SAREES ENDS HERE
          </h2>

          <h2
            className="text-6xl max-sm:text-4xl max-md:text-5xl font-semibold font-playfair uppercase"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            "Discover the Best,
            <br />
            Shop with Confidence"
          </h2>

          <div className="mt-6" data-aos="fade-up" data-aos-delay="600">
            <Link to={'/shop'}>
              <ProperButton text="Shop Now" />
            </Link>
          </div>
        </div>

        {/* Smooth Gradient Transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Additional Sections */}
      <HeaderSections />
    </div>
  );
};

export default Header;