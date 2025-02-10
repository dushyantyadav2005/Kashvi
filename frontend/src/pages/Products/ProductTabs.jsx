import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

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
    <div className="flex flex-col md:flex-row flex-wrap gap-4">
      <section className="flex md:flex-col w-full md:w-auto flex-shrink-0">
        {["Write Your Review", "All Reviews", "Related Products"].map((tab, index) => (
          <div
            key={index}
            className={`p-4 cursor-pointer text-lg ${activeTab === index + 1 ? "font-bold" : ""}`}
            onClick={() => handleTabClick(index + 1)}
          >
            {tab}
          </div>
        ))}
      </section>

      {/* Content */}
      <section className="flex-1 min-w-[250px] max-w-full md:max-w-[50%]">
        {activeTab === 1 && (
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label htmlFor="rating" className="block text-xl mb-2">Rating</label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 border rounded-lg w-full text-black"
                  >
                    <option value="">Select</option>
                    {["Inferior", "Decent", "Great", "Excellent", "Exceptional"].map((label, i) => (
                      <option key={i} value={i + 1}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-xl mb-2">Comment</label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg w-full text-black"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg w-full"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>Please <Link to="/login" className="text-blue-500">sign in</Link> to write a review</p>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-4">
            {product.reviews.length === 0 && <p>No Reviews</p>}
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between text-gray-400">
                  <strong>{review.name}</strong>
                  <p>{review.createdAt.substring(0, 10)}</p>
                </div>
                <p className="my-4">{review.comment}</p>
                <Ratings value={review.rating} />
              </div>
            ))}
          </div>
        )}
      </section>

      {activeTab === 3 && (
        <section className="flex flex-wrap gap-4 w-full">
          {isLoading ? (
            <Loader />
          ) : (
            data.map((product) => (
              <SmallProduct key={product._id} product={product} />
            ))
          )}
        </section>
      )}
    </div>
  );
};

export default ProductTabs;
