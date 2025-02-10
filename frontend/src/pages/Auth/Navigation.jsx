import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      setDropdownOpen(false); // Close dropdown on logout
    } catch (error) {
      console.error(error);
    }
  };

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <nav className="bg-slate-300  text-black w-full sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <ul className="flex gap-6 text-lg font-medium">
          <li className="hover:text-[#D4AF37] transition-all">
            <Link to="/" className="flex items-center gap-2">
              <AiOutlineHome size={26} />
              <span className="hidden md:inline">HOME</span>
            </Link>
          </li>
          <li className="hover:text-[#D4AF37] transition-all">
            <Link to="/shop" className="flex items-center gap-2">
              <AiOutlineShopping size={26} />
              <span className="hidden md:inline">SHOP</span>
            </Link>
          </li>
          <li className="relative hover:text-[#D4AF37] transition-all">
            <Link to="/cart" className="flex items-center gap-2">
              <AiOutlineShoppingCart size={26} />
              <span className="hidden md:inline">CART</span>
            </Link>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#1A2238] px-2 py-1 text-xs rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </li>
          <li className="hover:text-[#D4AF37] transition-all">
            <Link to="/favorite" className="flex items-center gap-2">
              <FaHeart size={20} />
              <span className="hidden md:inline">FAVORITES</span>
              <FavoritesCount />
            </Link>
          </li>
        </ul>

        <div className="relative">
          {userInfo ? (
            <div className="flex items-center gap-4 text-lg font-medium">
              <button
                className="flex items-center gap-2 bg-gray-500 text-white px-3 py-2 rounded-full hover:bg-gray-600 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <AiOutlineUser size={26} />
                <span className="hidden md:inline">{userInfo.username}</span>
                <span className="text-sm">▼</span>
              </button>

              {dropdownOpen && (
                <ul className="absolute right-0 top-full mt-2 bg-white text-gray-700 shadow-lg rounded-lg overflow-hidden w-48">
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>
                          Products
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>
                          Category
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>
                          Users
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="hover:text-[#D4AF37] transition-all">
                <AiOutlineLogin size={26} />
                <span className="hidden md:inline">LOGIN</span>
              </Link>
              <Link to="/register" className="hover:text-[#D4AF37] transition-all">
                <AiOutlineUserAdd size={26} />
                <span className="hidden md:inline">REGISTER</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
