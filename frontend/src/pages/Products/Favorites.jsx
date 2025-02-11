import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">FAVORITE PRODUCTS</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {favorites.map((product) => (
          <div key={product._id} className="border rounded-lg overflow-hidden shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <div className="flex items-center mt-2">
                <span className="text-md font-bold">${product.price}</span>
                {product.discount && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ${product.originalPrice}
                  </span>
                )}
                {product.discount && (
                  <span className="text-sm text-red-500 ml-2">
                    {product.discount}% Off
                  </span>
                )}
              </div>
              <button className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                ADD TO CART
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;