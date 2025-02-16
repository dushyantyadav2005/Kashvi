import { useState } from "react";
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

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

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

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div className="my-2">
        <Link to="/" className="text-blue-500 hover:underline">
          &lt; Back to Products
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Product Image */}
          <div className="w-full lg:w-1/2 flex-shrink-4">
            <img src={product.image} alt={product.name} className="w-full rounded" />
            <HeartIcon product={product} />
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-10 space-y-3">
            <h2 className="text-5xl font-semibold">{product.name}</h2>
            {/* product description will come here */}
            <p className="text-gray-500 text-sm md:w-[40vw]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, eveniet! Assumenda maxime sit dolorum reprehenderit ipsa illum unde quidem perspiciatis expedita, excepturi quaerat repellat explicabo sint quos ea qui culpa eveniet quasi, possimus nesciunt repudiandae, ad consequuntur. Ratione ut sapiente dolorem tenetur quaerat laborum ipsum. Consequuntur aperiam, laboriosam autem illo dolores dolore tenetur minima sint quia beatae est eos fugit vel fugiat culpa repellendus nihil debitis et ipsa cum molestiae. Aliquid, aut, ducimus vel sapiente atque reiciendis tempore magni unde eveniet, voluptatibus at? Ut illum asperiores hic officiis quia, sequi perspiciatis culpa omnis dolorum, doloribus qui molestias aspernatur inventore repellendus.</p>  
            <div className="text-sm text-gray-400 flex flex-col space-y-2">
              <span className="flex items-center">
                <FaStore className="mr-2" /> Brand: {product.brand}
              </span>
              <span className="flex items-center">
                <FaClock className="mr-2" /> Added: {moment(product.createAt).fromNow()}
              </span>
              <span className="flex items-center">
                <FaStar className="mr-2" /> Reviews: {product.numReviews}
              </span>
              <span className="flex items-center">
                <FaShoppingCart className="mr-2" /> Quantity: {product.quantity}
              </span>
              <span className="flex items-center">
                <FaBox className="mr-2" /> In Stock: {product.countInStock}
              </span>
              {/* DesignNumber Section */}
              <span className="flex items-center">
                <FaBox className="mr-2" /> Design Number: {product.designNumber}
              </span>
            </div>

            {/* Rating */}
            <Ratings value={product.rating} text={`${product.numReviews} reviews`} />

            {/* Quantity Selector */}
            {product.countInStock > 0 && (
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="bg-yellow-500 text-white py-2 px-4 rounded text-sm"
            >
              Add To Cart
            </button>
            {/* Reviews Section */}
            <div className="mt-4">
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
    </>
  );
};

export default ProductDetails;
