import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import ProductCard from "./ProductCard";
import Loader from "../../components/Loader";



const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="py-3 flex flex-col items-center w-full">
            <img src="../../images/embupsidedown.png" alt="" className='w-full h-auto opacity-50' />

            <h2 className="h4 text-center font-playfair capitalize m-10 mb-0 text-4xl">FAVORITE</h2>
            <h2 className="h4 text-center font-montserrat capitalize m-10 mt-0 text-xl">SAREES</h2>
            <div className="flex flex-wrap justify-center">
              {favorites.length === 0 ? (
                <Loader />
              ) : (
                favorites?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
  );
};

export default Favorites;
