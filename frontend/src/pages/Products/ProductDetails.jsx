import { useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Loader for add to cart

  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setZoomImageCoordinate({ x, y });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = async () => {
    setIsAddingToCart(true); // Start loader
    try {
      await dispatch(addToCart({ ...product, qty })).unwrap();
      navigate("/cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false); // Stop loader
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="text-gray-500 hover:text-gray-700 text-sm mb-6 inline-block"
      >
        &larr; Back to Products
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image with Zoom */}
          <div
            className="lg:w-1/2 relative"
            onMouseMove={handleZoomImage}
            onMouseLeave={handleLeaveImageZoom}
          >
            <div className="h-[600px] w-full border rounded-xl bg-white p-8 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />

              {/* Zoomed Image */}
              {zoomImage && (
                <div
                  className="hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0"
                  style={{
                    backgroundImage: `url('${product.image.replace(/\\/g, "/")}')`,
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                    backgroundSize: '200%'
                  }}
                >
                  <div className="w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150"></div>
                </div>
              )}

              <HeartIcon product={product} className="absolute top-6 right-6 z-10" />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-3xl font-light text-gray-900">{product.name}</h1>

            <div className="space-y-4">
              <Ratings
                value={product.rating}
                text={`${product.numReviews} reviews`}
                className="text-lg"
              />

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <FaStore className="text-gray-400 min-w-[16px]" />
                  <span>{product.brand}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock className="text-gray-400 min-w-[16px]" />
                  <span>{moment(product.createAt).fromNow()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaShoppingCart className="text-gray-400 min-w-[16px]" />
                  <span>{product.quantity} units</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaBox className="text-gray-400 min-w-[16px]" />
                  <span>{product.countInStock} in stock</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-6">
                  {product.countInStock > 0 && (
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="border rounded-md px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0 || isAddingToCart}
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-colors
                      ${product.countInStock === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'}
                    `}
                  >
                    {isAddingToCart ? <Loader small /> : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;