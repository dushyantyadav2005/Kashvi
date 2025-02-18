import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineContacts,
  AiOutlineBook
} from "react-icons/ai";
import { MdFavoriteBorder } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation, useVerifyEmailMutation } from "../redux/api/usersApiSlice";
import { logout } from "../redux/features/auth/authSlice";
import FavoritesCount from "../pages/Products/FavoritesCount";
import { toast } from "react-toastify";
import { FaBlog } from "react-icons/fa";

const Navigation = () => {
  const { loading, setLoading } = useState(false);
  const { userInfo, isVerified } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      setDropdownOpen(false); // Close dropdown on logout
      setSidebarOpen(false); // Close sidebar on logout
    } catch (error) {
      console.error(error);
    }
  };

  const verifyEmailHandler = async () => {
    setLoading(true);
    try {
      const response = await verifyEmail({ email: userInfo.email }).unwrap();
      toast.success(response.message);
      navigate("/otp");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  const closeDropdown = () => setDropdownOpen(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

          {/* Center - Navigation Links (Hidden on mobile) */}
          <div className="w-2/4 hidden md:flex justify-center">
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
              <li className="relative hover:text-[#D4AF37] group">
                <Link to="/blogs" className="flex items-center gap-1" onClick={toggleSidebar}>
                  <span>BLOG</span>
                </Link>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="relative hover:text-[#D4AF37] group">
                <Link to="/contact" className="flex items-center gap-1">
                  <span className="hidden md:inline">Contact Us</span>
                </Link>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </li>
            </ul>
          </div>

          {/* Right - User Profile */}
          <div className="w-1/4 flex max-sm:justify-center justify-end gap-4 items-center">
            {userInfo ? (
              <div className="flex items-center gap-2 text-base font-medium relative">
                <button
                  className="flex items-center gap-1 bg-[#D4AF37] text-white px-3 py-1.5 rounded-full hover:bg-[#800e25] transition-all duration-300 transform hover:scale-105 focus:outline-none shadow-md hover:shadow-lg"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <AiOutlineUser size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                  <span className="hidden md:inline">{userInfo.username}</span>
                  <span className={`text-xs transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {dropdownOpen && (
                  <ul className="absolute right-0 top-full mt-2 bg-[#800e25d2] text-[#efdcd9] shadow-lg rounded-lg overflow-hidden w-48 backdrop-blur-lg border border-[#D4AF37]">
                    {userInfo.isAdmin && (
                      <>
                  
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
                    {!isVerified && (
                      <li>
                        <button
                          onClick={verifyEmailHandler}
                          className="w-full text-left px-4 py-2 hover:bg-[#D4AF37] hover:text-white transition-all duration-300 flex items-center gap-2"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            "Verify Email"
                          )}
                        </button>
                      </li>
                    )}
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

            {/* Hamburger Menu for Mobile */}
            <button
              className="md:hidden text-[#efdcd9] focus:outline-none"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-[#800e25d2] backdrop-blur-lg z-40 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Close icon inside the sidebar */}
        <div className="flex justify-end p-4">
          <button onClick={toggleSidebar} className="text-[#efdcd9] focus:outline-none">
            <AiOutlineClose size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-start h-full pt-4">
          <ul className="flex flex-col gap-6 text-lg w-full font-medium tracking-wide bg-[#800e25d2] p-4">
            <li className="hover:text-[#D4AF37] group relative">
              <Link to="/" className="flex items-center gap-1" onClick={toggleSidebar}>
                <AiOutlineHome size={20} />
                <span>HOME</span>
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="hover:text-[#D4AF37] group relative">
              <Link to="/shop" className="flex items-center gap-1" onClick={toggleSidebar}>
                <AiOutlineShopping size={20} />
                <span>SHOP</span>
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="relative hover:text-[#D4AF37] group">
              <Link to="/cart" className="flex items-center gap-1" onClick={toggleSidebar}>
                <AiOutlineShoppingCart size={20} />
                <span>CART</span>
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#1A2238] px-1.5 py-0.5 text-xs rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </li>
            <li className="relative hover:text-[#D4AF37] group">
              <Link to="/blogs" className="flex items-center gap-1" onClick={toggleSidebar}>
                <AiOutlineBook size={20} />
                <span>Blogs</span>
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#1A2238] px-1.5 py-0.5 text-xs rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </li>
            <li className="relative hover:text-[#D4AF37] group">
              <Link to="/contact" className="flex items-center gap-1" onClick={toggleSidebar}>
                <AiOutlineContacts size={20} />
                <span>Contact us</span>
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#1A2238] px-1.5 py-0.5 text-xs rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </li>
            <li className="relative hover:text-[#D4AF37] group">
              <Link to="/favorite" className="flex items-center gap-1" onClick={toggleSidebar}>
                <MdFavoriteBorder size={20} />
                <span>FAVOURITES</span>
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              <FavoritesCount />
            </li>


            {userInfo ? (
              <>
                <li>
                  <Link to="/profile" className="flex items-center gap-1" onClick={toggleSidebar}>
                    <AiOutlineUser size={20} />
                    <span>PROFILE</span>
                  </Link>
                </li>
                {!isVerified && (
                  <li>
                    <button
                      onClick={() => {
                        verifyEmailHandler();
                        toggleSidebar();
                      }}
                      className="flex items-center gap-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "VERIFY EMAIL"
                      )}
                    </button>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      logoutHandler();
                      toggleSidebar();
                    }}
                    className="flex items-center gap-1"
                  >
                    <span>LOGOUT</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="flex items-center gap-1" onClick={toggleSidebar}>
                    <AiOutlineLogin size={20} />
                    <span>LOGIN</span>
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="flex items-center gap-1" onClick={toggleSidebar}>
                    <AiOutlineUserAdd size={20} />
                    <span>REGISTER</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <img src="../../images/larger.png" alt="" className="w-full h-auto" />
    </nav>
  );
};

export default Navigation;