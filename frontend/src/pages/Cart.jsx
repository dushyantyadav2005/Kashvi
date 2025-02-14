import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const user = useSelector((state) => state.user);
  const { isVerified } = user;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = async () => {
    if (!isVerified) {
      toast.error('You need to verify your account to proceed with checkout.');
      return;
    }

    try {
      // Configure axios with proper headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const response = await axios.post('http://localhost:5000/getinvoice', {
        items: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          brand: item.brand
        }))
      }, config);

      if (response.data && response.data.message) {
        console.log('Invoice generated:', response.data);
        navigate("/login?redirect=/shipping");
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      if (error.response) {
        toast.error(`Failed to generate invoice: ${error.response.data.detail || 'Server error'}`);
      } else if (error.request) {
        toast.error('Failed to connect to server. Please check if the server is running.');
      } else {
        toast.error('Failed to generate invoice. Please try again.');
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container flex justify-around items-start flex-wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div>
            Your cart is empty <Link to="/shop">Go To Shop</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%]">
              <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div key={item._id} className="flex items-enter mb-[1rem] pb-2">
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link to={`/product/${item._id}`} className="text-pink-500">
                      {item.name}
                    </Link>

                    <div className="mt-2 text-white">{item.brand}</div>
                
                  </div>

                  <div className="w-24">
                    <select
                      className="w-full p-1 border rounded text-black"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      className="text-red-500 mr-[5rem]"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="ml-[1rem] mt-[.5rem]" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>

                  <button
                    className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Send Invoice
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
