import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      easing: "ease-out", // Smooth easing effect
      once: true, // Ensures animation runs only once
    });
  }, []);

  return (
    <>
      {!keyword && <Header />}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{isError?.data.message || isError.error}</Message>
      ) : (
        <>
          {/* Title and Shop Link */}
          {/* <div
            className="flex flex-col md:flex-row justify-between items-center mt-16 px-4 md:px-20"
            data-aos="fade-up"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
              Special Products
            </h1>
            <Link
              to="/shop"
              className="bg-pink-600 text-white font-bold rounded-full py-2 px-6 md:px-10 mt-4 md:mt-0"
              data-aos="fade-left"
              data-aos-delay="500"
            >
              Shop
            </Link>
          </div> */}

          {/* Product Grid */}
          {/* <div className="mt-8 px-4">
            <div className="flex flex-wrap justify-center">
              {data.products.map((product, index) => (
                <div
                  key={product._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 200} // Staggered animation effect
                >
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div> */}
        </>
      )}
    </>
  );
};

export default Home;