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
    <div className="mb-4 min-h-screen w-full lg:block xl:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <Slider
          {...settings}
          className="w-[80vw] mx-auto h-[100%]"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div
                key={_id}
                className="relative h-[30rem] rounded-lg overflow-hidden"
              >
                {/* Product Image */}
                <img
                  src={image}
                  alt={name}
                  className="w-full  object-cover object-center"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-4 rounded-lg">
                  <div>
                    <h2 className="text-white text-2xl font-bold">{name}</h2>
                    <p className="text-white text-lg font-semibold"> $ {price}</p>
                    <p className="text-white mt-4 w-[25rem]">
                      {description.substring(0, 170)} ...
                    </p>
                  </div>

                  <div className="flex justify-between w-full text-white">
                    <div>
                      <h1 className="flex items-center mb-6">
                        <FaStore className="mr-2" /> Brand: {brand}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaClock className="mr-2" /> Added: {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaStar className="mr-2" /> Reviews: {numReviews}
                      </h1>
                    </div>

                    <div>
                      <h1 className="flex items-center mb-6">
                        <FaStar className="mr-2" /> Ratings: {Math.round(rating)}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaShoppingCart className="mr-2" /> Quantity: {quantity}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaBox className="mr-2" /> In Stock: {countInStock}
                      </h1>
                    </div>
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
