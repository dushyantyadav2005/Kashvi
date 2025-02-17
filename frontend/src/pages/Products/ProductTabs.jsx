import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import { FaStar, FaCommentAlt, FaBoxOpen } from "react-icons/fa";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) return <Loader />;

  const handleTabClick = (tabNumber) => setActiveTab(tabNumber);

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      {/* Tabs Navigation */}
      <nav className="flex md:flex-col gap-2 w-full md:w-64 flex-shrink-0">
        {[
          { label: "Write Review", icon: <FaCommentAlt className="mr-2" /> },
          { label: "All Reviews", icon: <FaStar className="mr-2" /> },
          { label: "Related Products", icon: <FaBoxOpen className="mr-2" /> },
        ].map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index + 1)}
            className={`flex items-center p-4 text-lg rounded-lg transition-colors ${
              activeTab === index + 1
                ? "bg-pink-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="flex-1">
        {/* Write Review Tab */}
        {activeTab === 1 && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-lg font-medium mb-2">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                    required
                  >
                    <option value="">Select your rating</option>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {["Inferior", "Decent", "Great", "Excellent", "Exceptional"][value - 1]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-lg font-medium mb-2">
                    Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  {loadingProductReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Please sign in to share your review
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 2 && (
          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-xl text-center text-gray-500">
                No reviews yet - be the first to share your experience!
              </div>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {review.name}
                      </h4>
                      <Ratings value={review.rating} />
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Related Products Tab */}
        {activeTab === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <Loader />
            ) : data && data.length > 0 ? (
              data.map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full bg-gray-50 p-6 rounded-xl text-center text-gray-500">
                No related products found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;