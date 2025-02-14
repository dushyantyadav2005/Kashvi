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
} from "react-icons/ai";
import { MdFavoriteBorder } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation, useVerifyEmailMutation } from "../../redux/api/usersApiSlice";
import { logout, setVerified } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const Navigation = () => {
  const { userInfo, isVerified } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [loading, setLoading] = useState(false);

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
      dispatch(setVerified(true));
      navigate("/otp");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  const closeDropdown = () => setDropdownOpen(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <nav className="bg-[#24110c]/80 h-[9vh] text-[#efdcd9] w-full flex justify-center fixed top-0 z-50 shadow-lg shadow-[#24110c]/50 font-montserrat border-b-4 border-b-[#D4AF37] backdrop-blur-lg">
      <div className="w-full flex justify-between items-center py-3 px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <img
          src="../../images/logopng.png"
          alt="Logo"
          className="h-[8vw] max-h-12"
        />

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-2xl text-[#efdcd9] focus:outline-none"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex gap-6 text-base font-medium tracking-wide">
          <li className="hover:text-[#D4AF37] group relative">
            <Link to="/" className="flex items-center gap-2">
              <AiOutlineHome size={17} />
              <span className="hidden md:inline">HOME</span>
            </Link>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-[#D4AF37] group relative">
            <Link to="/shop" className="flex items-center gap-2">
              <AiOutlineShopping size={17} />
              <span className="hidden md:inline">SHOP</span>
            </Link>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="relative hover:text-[#D4AF37] group">
            <Link to="/cart" className="flex items-center gap-2">
              <AiOutlineShoppingCart size={17} />
              <span className="hidden md:inline">CART</span>
            </Link>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#1A2238] px-2 py-1 text-xs rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </li>
          <li className="relative hover:text-[#D4AF37] group">
            <Link to="/favorite" className="flex items-center gap-2">
              <MdFavoriteBorder size={17} />
              <span className="hidden md:inline">FAVOURITES</span>
            </Link>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            <FavoritesCount />
          </li>
        </ul>

        {/* User Actions (Login/Register or User Dropdown) */}
        <div className="hidden md:flex items-center gap-4">
          {loading && <div className="loader">Loading...</div>}
          {userInfo ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 bg-[#6f1718] text-white px-3 py-2 rounded-full hover:bg-[#b02a17] focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <AiOutlineUser size={17} />
                <span className="hidden md:inline">{userInfo.username}</span>
                <span className="text-sm">▼</span>
              </button>

              {dropdownOpen && (
                <ul className="absolute right-0 top-full mt-2 bg-white text-gray-700 shadow-lg rounded-lg overflow-hidden w-48">
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100 relative group" onClick={closeDropdown}>
                          <span>Dashboard</span>
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100 relative group" onClick={closeDropdown}>
                          <span>Products</span>
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-gray-100 relative group" onClick={closeDropdown}>
                          <span>Category</span>
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-100 relative group" onClick={closeDropdown}>
                          <span>Orders</span>
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-100 relative group" onClick={closeDropdown}>
                          <span>Users</span>
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 relative group" onClick={closeDropdown}>
                      <span>Profile</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                  {!isVerified && (
                    <li>
                      <button
                        onClick={verifyEmailHandler}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 relative group"
                      >
                        <span>Verify Email</span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 relative group"
                    >
                      <span>Logout</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="hover:text-[#D4AF37] relative group flex items-center gap-2">
                <AiOutlineLogin size={17} />
                <span className="hidden md:inline">LOGIN</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link to="/register" className="hover:text-[#D4AF37] relative group flex items-center gap-2">
                <AiOutlineUserAdd size={17} />
                <span className="hidden md:inline">REGISTER</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-[#24110c]/90 backdrop-blur-lg z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex justify-end p-4">
            <button
              className="text-2xl text-[#efdcd9] focus:outline-none"
              onClick={toggleSidebar}
            >
              <AiOutlineClose />
            </button>
          </div>
          <ul className="flex flex-col gap-6 p-4 bg-[#24110c]/90 backdrop-blur-lg">
            <li>
              <Link to="/" className="flex items-center gap-2" onClick={toggleSidebar}>
                <AiOutlineHome size={20} />
                <span>HOME</span>
              </Link>
            </li>
            <li>
              <Link to="/shop" className="flex items-center gap-2" onClick={toggleSidebar}>
                <AiOutlineShopping size={20} />
                <span>SHOP</span>
              </Link>
            </li>
            <li>
              <Link to="/cart" className="flex items-center gap-2" onClick={toggleSidebar}>
                <AiOutlineShoppingCart size={20} />
                <span>CART</span>
                {cartItems.length > 0 && (
                  <span className="bg-[#D4AF37] text-[#1A2238] px-2 py-1 text-xs rounded-full">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/favorite" className="flex items-center gap-2" onClick={toggleSidebar}>
                <MdFavoriteBorder size={20} />
                <span>FAVOURITES</span>
              </Link>
            </li>
            {userInfo ? (
              <>
                <li>
                  <Link to="/profile" className="flex items-center gap-2" onClick={toggleSidebar}>
                    <AiOutlineUser size={20} />
                    <span>PROFILE</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-2"
                  >
                    <AiOutlineLogin size={20} />
                    <span>LOGOUT</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="flex items-center gap-2" onClick={toggleSidebar}>
                    <AiOutlineLogin size={20} />
                    <span>LOGIN</span>
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="flex items-center gap-2" onClick={toggleSidebar}>
                    <AiOutlineUserAdd size={20} />
                    <span>REGISTER</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
