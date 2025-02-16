import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import ProperButtonBlack from "../components/ProperButtonBlack";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const [showCategories, setShowCategories] = useState(false);
  const [showFestivals, setShowFestivals] = useState(false);
  const [showDesignNumber, setShowDesignNumber] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [designNumberFilter, setDesignNumberFilter] = useState("");

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading) {
      // Filter products based on checked categories, selected Festival, and design number filter
      const filteredProducts = filteredProductsQuery.data.filter((product) => {
        const matchesCategory =
          !selectedCategory || product.category === selectedCategory;
        const matchesFestival = !selectedFestival || product.festival === selectedFestival;
        const matchesDesignNumber =
          !designNumberFilter ||
          product.designNumber
            .toString()
            .toLowerCase()
            .includes(designNumberFilter.toLowerCase());

        return matchesCategory && matchesFestival && matchesDesignNumber;
      });

      dispatch(setProducts(filteredProducts));
    }
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    dispatch,
    selectedCategory,
    selectedFestival,
    designNumberFilter,
  ]);

  const handleFestivalClick = (festival) => {
    setSelectedFestival(festival === selectedFestival ? "" : festival);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
    dispatch(setChecked(categoryId ? [categoryId] : []));
  };

  const handleDesignNumberChange = (e) => {
    setDesignNumberFilter(e.target.value);
  };

  const uniqueFestivals = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.festival)
          .filter((festival) => festival !== undefined)
      )
    ),
  ];

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row">
          <div className="p-5 py-14 mb-2 border-r-2 border-[#D4AF37] shadow-lg shadow-[#24110c]/10 min-w-[200px]">
            <h2 className="text-2xl font-playfair text-[#24110c] mb-8 text-center">Filter By</h2>

            {/* Categories Filter */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-normal font-montserrat uppercase text-[#24110c]">
                  Categories
                </h2>
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="text-[#D4AF37] hover:text-[#e3af03] transition-all duration-300"
                >
                  <div className={`transform transition-transform duration-300 ${showCategories ? 'rotate-180' : 'rotate-0'}`}>
                    <AiOutlinePlus size={20} />
                  </div>
                </button>
              </div>
              <div className="w-full h-[1px] bg-[#D4AF37]/30 mb-4"></div>

              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showCategories ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col items-start space-y-3 pl-4">
                  {categories?.map((c) => (
                    <div key={c._id} className="flex items-center group w-full cursor-pointer" onClick={() => handleCategoryClick(c._id)}>
                      <div className="relative w-4 h-4">
                        <input
                          type="radio"
                          id={c._id}
                          name="category"
                          checked={selectedCategory === c._id}
                          onChange={() => { }}
                          className="absolute opacity-0 w-4 h-4 cursor-pointer"
                        />
                        <div className={`w-4 h-4 border-2 rounded-full transition-all duration-300 ${selectedCategory === c._id ? 'border-[#D4AF37]' : 'border-gray-400 group-hover:border-[#D4AF37]'}`}>
                          <div className={`w-2 h-2 rounded-full bg-[#D4AF37] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${selectedCategory === c._id ? 'scale-100' : 'scale-0'}`}></div>
                        </div>
                      </div>
                      <label
                        htmlFor={c._id}
                        onClick={() => handleCategoryClick(c._id)}
                        className={`ml-3 text-sm font-normal font-montserrat cursor-pointer transition-colors duration-300 ${selectedCategory === c._id ? 'text-[#D4AF37]' : 'text-black group-hover:text-[#D4AF37]'}`}
                      >
                        {c.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Festivals Filter */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-normal font-montserrat uppercase text-[#24110c]">
                  Festivals
                </h2>
                <button
                  onClick={() => setShowFestivals(!showFestivals)}
                  className="text-[#D4AF37] hover:text-[#e3af03] transition-all duration-300"
                >
                  <div className={`transform transition-transform duration-300 ${showFestivals ? 'rotate-180' : 'rotate-0'}`}>
                    <AiOutlinePlus size={20} />
                  </div>
                </button>
              </div>
              <div className="w-full h-[1px] bg-[#D4AF37]/30 mb-4"></div>

              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showFestivals ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col items-start space-y-3 pl-4">
                  {uniqueFestivals?.map((festival) => (
                    <div key={festival} className="flex items-center group w-full cursor-pointer" onClick={() => handleFestivalClick(festival)}>
                      <div className="relative w-4 h-4">
                        <input
                          type="radio"
                          id={festival}
                          name="festival"
                          checked={selectedFestival === festival}
                          onChange={() => { }}
                          className="absolute opacity-0 w-4 h-4 cursor-pointer"
                        />
                        <div className={`w-4 h-4 border-2 rounded-full transition-all duration-300 ${selectedFestival === festival ? 'border-[#D4AF37]' : 'border-gray-400 group-hover:border-[#D4AF37]'}`}>
                          <div className={`w-2 h-2 rounded-full bg-[#D4AF37] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${selectedFestival === festival ? 'scale-100' : 'scale-0'}`}></div>
                        </div>
                      </div>
                      <label
                        htmlFor={festival}
                        onClick={() => handleFestivalClick(festival)}
                        className={`ml-3 text-sm font-normal font-montserrat cursor-pointer transition-colors duration-300 ${selectedFestival === festival ? 'text-[#D4AF37]' : 'text-black group-hover:text-[#D4AF37]'}`}
                      >
                        {festival}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Design Number Filter */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-normal font-montserrat uppercase text-[#24110c]">
                  Design Number
                </h2>
                <button
                  onClick={() => setShowDesignNumber(!showDesignNumber)}
                  className="text-[#D4AF37] hover:text-[#e3af03] transition-all duration-300"
                >
                  <div className={`transform transition-transform duration-300 ${showDesignNumber ? 'rotate-180' : 'rotate-0'}`}>
                    <AiOutlinePlus size={20} />
                  </div>
                </button>
              </div>
              <div className="w-full h-[1px] bg-[#D4AF37]/30 mb-4"></div>

              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showDesignNumber ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex justify-center px-4">
                  <input
                    type="text"
                    placeholder="Enter Design Number"
                    value={designNumberFilter}
                    onChange={handleDesignNumberChange}
                    className="w-full px-3 py-2 placeholder-gray-400 border border-[#D4AF37] rounded-lg focus:outline-none focus:ring focus:border-[#D4AF37] bg-[#efdcd9]/10 text-black text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="  ">
              <ProperButtonBlack text="Reset" name="reset" className="w-full mx-auto" />
            </div>
          </div>

          {/* Products Section */}
          <div className="py-3 flex flex-col items-center w-full">
            <img src="../../images/embupsidedown.png" alt="" className='w-full h-auto opacity-50' />

            <h2 className="h4 text-center font-playfair capitalize m-10 text-3xl">{products?.length} SAREES</h2>
            <div className="flex flex-wrap justify-center">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;