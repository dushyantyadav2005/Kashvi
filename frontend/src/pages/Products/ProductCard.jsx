    // Rewritten code with larger favorite button and theme colors
    import { Link } from "react-router-dom";
    import { AiOutlineShoppingCart } from "react-icons/ai";
    import { useDispatch } from "react-redux";
    import { addToCart } from "../../redux/features/cart/cartSlice";
    import { toast } from "react-toastify";
    import HeartIcon from "./HeartIcon";
    import ProperButtonBlack from "../../components/ProperButton";
    import ProperButton from "../../components/ProperButton";
    
    const ProductCard = ({ p }) => {
      const dispatch = useDispatch();
    
      const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
        toast.success("Item added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      };
    
      return (
        <div className="w-[280px] relative bg-[#8e0e28d4] rounded-lg shadow group overflow-hidden">
          <section className="relative">
            <Link to={`/product/${p._id}`}>
              <span className="absolute bottom-3 right-3 bg-[#f8bb82] text-white text-sm font-montserrat px-2.5 py-0.5 rounded-full">
                {p?.brand}
              </span>
              <img
                className="h-[430px] cursor-pointer w-full object-cover object-center rounded-lg group-hover:brightness-75 group-hover:scale-105 transform transition-transform duration-300"
                src={p.image}
                alt={p.name}
              />
            </Link>
            {/* Updated HeartIcon with larger size and theme-based color */}
            <HeartIcon product={p} className="w-10 h-10 text-yellow-500" />
          </section>
    
          <div className="absolute bottom-0 left-0 w-full bg-[#8e0e28d4] p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex justify-between">
              <h5 className="mb-2 text-xl font-playfair text-[#ffffff]">{p?.name}</h5>
            </div>
    
            <p className="mb-5 font-montserrat text-xs text-[#ffffff]/60">
              {p?.description?.substring(0, 60)} ...
            </p>
    
            <section className="flex justify-between items-center">
              <Link to={`/product/${p._id}`}>
                <ProperButton text="Read More" name="readmore" className={""}/>
              </Link>
    
              <button
                className="p-2 rounded-full text-[#D4AF37] hover:text-[#e3af03] transition-all duration-300"
                onClick={() => addToCartHandler(p, 1)}
              >
                <AiOutlineShoppingCart size={25} />
              </button>
            </section>
          </div>
          <img src="../../images/embroidary.png" alt="" className="absolute bottom-0 left-0 w-full h-auto" />
        </div>
      );
    };
    
    export default ProductCard;
