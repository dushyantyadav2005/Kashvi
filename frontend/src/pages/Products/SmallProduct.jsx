import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[18rem] p-4 transition-transform duration-300 hover:scale-105 m-5">
      {/* Image Container */}
      <div className="relative group overflow-hidden rounded-lg shadow-md">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        />

        {/* Wishlist Icon */}
        <div className="absolute top-3 right-3">
          <HeartIcon product={product} />
        </div>

        {/* Quick View Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Link
            to={`/product/${product._id}`}
            className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition"
          >
            View
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-3 text-center">
        <Link
          to={`/product/${product._id}`}
          className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition"
        >
          {product.name}
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
