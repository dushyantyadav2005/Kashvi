import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { faker } from '@faker-js/faker';
import Loader from "../components/Loader"; // Import Loader Component
import ProperButtonBlack from "../components/ProperButtonBlack";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // Track loading state

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { userInfo, isVerified } = useSelector((state) => state.auth);

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

    setLoading(true); // Start loading before making the request

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const response = await axios.post('http://localhost:5000/api/invoice', {
        invoiceNo: faker.string.alphanumeric(10).toUpperCase(),
        email: userInfo.email,
        customerName: userInfo.username,
        items: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
        }))
      }, config);

      if (response.data && response.data.message) {
        console.log('Invoice generated:', response.data);
        toast.success("Invoice generated successfully! Kindly check your email to download the invoice.");
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice. Please try again.');
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };
  
  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <>
      <ToastContainer />
      <img src="../../images/embupsidedown.png" alt="" className='w-full h-auto opacity-50' />

          
          <div className="container flex justify-center items-center flex-wrap mx-auto mt-1 px-4 min-h-[90vh]">
            {cartItems.length === 0 ? (
              <div className="text-center text-[#efdcd9]">
                Your cart is empty <Link to="/shop" className="text-[#D4AF37] hover:underline">Go To Shop</Link>
              </div>
        ) : (
          <>
            <div className="flex flex-col w-full md:w-4/5">
            <h2 className="h4 text-center font-playfair m-10 mb-0 text-4xl uppercase">Shopping</h2>
            <h2 className="h4 text-center font-montserrat m-10 mt-0 text-xl uppercase">Cart</h2>

              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center mb-6 pb-4 border-b border-gray-700">
                  <div className="w-20 h-20">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-6">
                    <Link to={`/product/${item._id}`} className="text-[#D4AF37] hover:underline text-lg font-medium">
                      {item.name}
                    </Link>

                    <div className="mt-2 text-[#efdcd9]">{item.brand}</div>
                  </div>

                  <div className="w-24">
                    <select
                      className="w-full p-2 border border-[#D4AF37] rounded bg-[#c7304f] text-white"
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

                  <div className="ml-6">
                    <button
                      className="text-red-500 hover:text-[#D4AF37] transition-colors"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-10 w-full md:w-1/2 lg:w-1/3 mx-auto">
                <div className="p-6 rounded-lg flex flex-col justify-center items-center">
                  <h2 className="text-2xl font-semibold mb-4 text-[#D4AF37]">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>

                  <ProperButtonBlack
                    className=" mt-2 py-3 px-6 text-lg w-full flex justify-center items-center "
                    disabled={cartItems.length === 0 || loading}
                    onClick={checkoutHandler}
                    text={"Generate Invoice"}
                  />
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
