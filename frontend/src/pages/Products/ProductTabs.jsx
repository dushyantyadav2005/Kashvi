import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import { useGetFestivalProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import ProperButtonBlack from "../../components/ProperButtonBlack";

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
  const { data: festiveData, isLoading: festiveIsLoading } = useGetFestivalProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading || festiveIsLoading) return <Loader />;

  const handleTabClick = (tabNumber) => setActiveTab(tabNumber);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Tab Navigation */}
      <div className="lg:w-1/4 flex lg:flex-col overflow-hidden">
        {["Write Review", "All Reviews"].map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index + 1)}
            className={`p-4 text-left min-w-[200px] lg:w-full border-b-2 lg:border-b-0 lg:border-r-2 transition-all
              ${activeTab === index + 1 
                ? "border-[#D4AF37] text-[#D4AF37] bg-[#efdcd9]/10 font-semibold" 
                : "border-[#D4AF37]/30 text-[#24110c] hover:bg-[#efdcd9]/20"}
              font-montserrat text-sm uppercase tracking-wider`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 lg:pl-8">
        {/* Review Form */}
        {activeTab === 1 && (
          <div className="space-y-6">
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label htmlFor="rating" className="block font-playfair text-xl text-[#24110c] mb-3">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-3 border-2 border-[#D4AF37] rounded-lg bg-transparent font-montserrat focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  >
                    <option value="">Select Rating</option>
                    {["Inferior", "Decent", "Great", "Excellent", "Exceptional"].map((label, i) => (
                      <option key={i} value={i + 1} className="text-[#24110c]">
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="comment" className="block font-playfair text-xl text-[#24110c] mb-3">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 border-2 border-[#D4AF37] rounded-lg bg-transparent font-montserrat focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>

                <ProperButtonBlack
                  type="submit"
                  text={loadingProductReview ? "Submitting..." : "Submit Review"}
                  disabled={loadingProductReview}
                  className="w-full md:w-auto"
                >
                  {loadingProductReview ? "Submitting..." : "Submit Review"}
                </ProperButtonBlack>
              </form>
            ) : (
              <p className="font-montserrat text-[#24110c]">
                Please{" "}
                <Link to="/login" className="text-[#D4AF37] hover:underline">
                  sign in
                </Link>{" "}
                to write a review
              </p>
            )}
          </div>
        )}

        {/* All Reviews */}
        {activeTab === 2 && (
          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <p className="font-montserrat text-[#24110c]">No reviews yet</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="p-6 border-2 border-[#D4AF37] rounded-lg bg-[#efdcd9]/10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-playfair text-lg text-[#24110c]">{review.name}</h3>
                    <span className="font-montserrat text-sm text-[#24110c]/70">
                      {review.createdAt.substring(0, 10)}
                    </span>
                  </div>
                  <Ratings value={review.rating} className="mb-3" />
                  <p className="font-montserrat text-[#24110c]">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductTabs; 