import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="absolute -top-2 -right-2">
      {favoriteCount > 0 && (
        <span className=" bg-[#D4AF37] text-[#1A2238] px-2 py-1 text-xs rounded-full">
          {favoriteCount}
        </span>
      )}

    </div>
  );
};

export default FavoritesCount;
