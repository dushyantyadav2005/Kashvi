import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { MdFavoriteBorder } from "react-icons/md";
import { GrFavorite } from "react-icons/gr";
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
    <nav className="bg-[#800e25d2] h-auto text-[#efdcd9] w-full fixed top-0 z-50 shadow-lg shadow-[#24110c]/50 font-montserrat border-b-4 border-b-[#D4AF37] backdrop-blur-lg">
      <div className="w-full">
        <div className="w-full flex items-center justify-between p-2 pt-3 max-w-[1200px] mx-auto">
          {/* Left - Logo */}
          <div className="w-1/4">
            <img 
              src="../../images/logopng1.png" 
              alt="Logo"
              className="h-10"
            />
          </div>

          {/* Center - Navigation Links */}
          <div className="w-2/4 flex justify-center">
            <ul className="flex gap-7 text-sm font-medium tracking-wide">
              <li className="hover:text-[#D4AF37] group relative">
                <Link to="/" className="flex items-center gap-1"> 
                  <span className="hidden md:inline">HOME</span>
                </Link>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="hover:text-[#D4AF37] group relative">
                <Link to="/shop" className="flex items-center gap-1">
                  <span className="hidden md:inline">SHOP</span>
                </Link>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="hover:text-[#D4AF37] group relative">
                <Link to="/blogs" className="flex items-center gap-1">
                  <span className="hidden md:inline">BLOG</span>
                </Link>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="relative hover:text-[#D4AF37] group">
                <Link to="/cart" className="flex items-center gap-1">
                  <span className="hidden md:inline">CART</span>
                </Link>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#1A2238] px-1.5 py-0.5 text-xs rounded-full">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </li>
              <li className="relative hover:text-[#D4AF37] group">
                <Link to="/favorite" className="flex items-center gap-1">
                  <span className="hidden md:inline">FAVOURITES</span>
                </Link>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                <FavoritesCount />
              </li>
            </ul>
          </div>

          {/* Right - User Profile */}
          <div className="w-1/4 flex justify-end">
            {userInfo ? (
              <div className="flex items-center gap-2 text-base font-medium">
                <button
                  className="flex items-center gap-1 bg-[#D4AF37] text-white px-3 py-1.5 rounded-full hover:bg-[#800e25] transition-all duration-300 transform hover:scale-105 focus:outline-none shadow-md hover:shadow-lg"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <AiOutlineUser size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                  <span className="hidden md:inline">{userInfo.username}</span>
                  <span className={`text-xs transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {dropdownOpen && (
                  <ul className="absolute right-0 top-full mt-2 bg-[#800e25d2] text-[#efdcd9] shadow-lg rounded-lg overflow-hidden w-48 backdrop-blur-lg border border-[#D4AF37] mr-1">
                    {userInfo.isAdmin && (
                      <>
                        <li>
                          <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-[#D4AF37] hover:text-white transition-all duration-300" onClick={closeDropdown}>
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-[#D4AF37] hover:text-white transition-all duration-300" onClick={closeDropdown}>
                            Products
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-[#D4AF37] hover:text-white transition-all duration-300" onClick={closeDropdown}>
                            Category
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-[#D4AF37] hover:text-white transition-all duration-300" onClick={closeDropdown}>
                            Orders
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-[#D4AF37] hover:text-white transition-all duration-300" onClick={closeDropdown}>
                            Users
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <Link to="/profile" className="block px-4 py-2 hover:bg-[#D4AF37] hover:text-white transition-all duration-300" onClick={closeDropdown}>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/create-blog" className="block px-4 py-2 hover:bg-[#D4AF37] hover:text-white transition-all duration-300" onClick={closeDropdown}>
                        Create Blog
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logoutHandler}
                        className="block w-full text-left px-4 py-2 hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <div className="flex gap-2 text-sm">
                <Link to="/login" className="hover:text-[#D4AF37] relative group flex items-center gap-1">
                  <AiOutlineLogin size={15} />
                  <span className="hidden text-base font-medium tracking-wide md:inline">LOGIN</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link to="/register" className="hover:text-[#D4AF37] relative group flex items-center gap-1">
                  <AiOutlineUserAdd size={15} />
                  <span className="hidden text-base font-medium tracking-wide md:inline">REGISTER</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <img src="../../images/larger.png" alt="" className="w-full h-auto" />
    </nav>
  );
};

export default Navigation;
