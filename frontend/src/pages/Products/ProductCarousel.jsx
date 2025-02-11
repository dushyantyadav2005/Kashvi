import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false
  };

  return (
    <div className="mb-4 w-full lg:block xl:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <Slider
          {...settings}
          className="w-[80vw] m-3 mx-auto"
        >
          {products.map(
            ({
              image,
              _id,
              name,
            }) => (
              <div
                key={_id}
                className=" relative lg:h-[35rem] md:h-[35rem] overflow-hidden"
              >
                {/* Product Image */}
                <img
                  src={image}
                  alt={name}
                  className="w-full object-cover object-center max-md:aspect-[7/10]"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-4">
                  <div>
                    <h2 className="text-white text-2xl font-bold">{name}</h2>
                  </div>
                  <div className="logo">
                    <img src={""} alt="logo" />
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
