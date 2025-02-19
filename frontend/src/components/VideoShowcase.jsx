    import { useEffect, useRef } from "react";
    import AOS from "aos";
    import "aos/dist/aos.css";
    import ProperButton from "./ProperButton";
    import { Link } from "react-router-dom";

    const VideoShowcase = () => {
    const videoContainerRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        AOS.init({ duration: 500, easing: "ease-out", once: true });

        const handleScroll = () => {
        if (videoContainerRef.current) {
            const scrollTop = window.scrollY;
            const offsetTop = videoContainerRef.current.offsetTop;
            const height = videoContainerRef.current.offsetHeight;

            // Keep the video positioned properly while applying parallax
            if (scrollTop + window.innerHeight > offsetTop && scrollTop < offsetTop + height) {
            const parallaxOffset = (scrollTop - offsetTop) * 0.3;
            videoRef.current.style.transform = `translateY(${parallaxOffset}px)`;
            }
        }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div ref={videoContainerRef} className="relative w-full h-screen overflow-hidden">
        {/* Parallax Video Wrapper */}
        <div className="absolute inset-0">
            <video
            ref={videoRef}
            className="w-full h-full object-cover brightness-75 transition-transform duration-200 ease-out"
            autoPlay
            loop
            muted
            playsInline
            >
            <source src="/videos/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
            </video>
        </div>

        {/* Dark Overlay for Better Readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
            <h1
            className="text-6xl max-md:text-4xl font-bold tracking-wide font-playfair uppercase"
            data-aos="fade-up"
            >
            Elevate Your Elegance
            </h1>
            <p
            className="mt-4 text-lg md:text-xl opacity-80 max-w-2xl"
            data-aos="fade-up"
            data-aos-delay="300"
            >
            Experience the perfect blend of traditional craftsmanship and modern
            aesthetics.
            </p>

            <div data-aos="fade-up" data-aos-delay="500">
            <Link to={'/shop'}>
                <ProperButton text="Explore Now" className={"mt-6"} />
            </Link>
            </div>
        </div>

        {/* Gradient for Smooth Transition to Next Section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>
    );
    };

    export default VideoShowcase;
