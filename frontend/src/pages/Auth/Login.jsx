import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import ProperButtonBlack from "../../components/ProperButtonBlack";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials, setVerified } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res_login = await login({ email, password }).unwrap();
      dispatch(setCredentials({ userInfo: res_login, isVerified: res_login.isVerified }));
      if (res_login.isVerified) {
        dispatch(setVerified(true));
      }
      navigate(redirect);
      toast.success("Login successful");
    } catch (err) {
      console.log(err);
      toast.error(err.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-6 px-4 sm:px-6 md:py-8">
      <div className="flex-grow flex items-center justify-center">
        {isLoading && <Loader />}
        <div className="flex justify-between items-center mx-auto w-full max-w-md md:max-w-2xl lg:max-w-4xl border border-[#D4AF37] rounded-lg bg-white">
          {/* Left image - hidden on medium screens */}
          <img
            src="../../images/LoginPage.png"
            alt="Decorative left"
            className="h-full opacity-50 hidden lg:block"
          />

          <div className="w-full p-6 md:p-8 lg:w-1/2 flex flex-col justify-center items-center">
            <h2 className="text-3xl md:text-4xl text-center font-playfair mb-2 uppercase">
              Login
            </h2>
            <h3 className="text-lg md:text-xl text-center font-montserrat mb-6 md:mb-8 uppercase">
              your account
            </h3>

            <div className="w-full mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <span className="text-sm md:text-base text-center text-gray-500 uppercase px-2">
                login with email
              </span>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>

            <form onSubmit={submitHandler} className="w-full mt-6 space-y-6">
              <div>
                <label className="block text-sm md:text-base font-semibold mb-3">
                  Email Address
                </label>
                <input
                  className="w-full py-3 px-4 border border-[#480815] bg-[#c3183a16] 
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                           text-base md:text-lg"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="block text-sm md:text-base font-semibold mb-3">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-[#D4AF37]">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  className="w-full py-3 px-4 border border-[#480815] bg-[#c3183a16] 
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                           text-base md:text-lg"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="mt-8">
                <ProperButtonBlack
                  disabled={isLoading}
                  type="submit"
                  className="w-full py-3 text-lg md:text-xl"
                  text={isLoading ? "Signing In..." : "Login"}
                >
                  {isLoading ? "Signing In..." : "Login"}
                </ProperButtonBlack>
              </div>
            </form>

            <div className="w-full mt-6 flex items-center justify-center space-x-2">
              <span className="flex-1 border-b"></span>
              <Link
                to={`${redirect ? "/register?redirect=${redirect}" : "/register"}`}
                className="text-sm text-gray-500 uppercase hover:text-[#D4AF37]"
              >
                or <b className="text-[#D4AF37]">sign up</b>
              </Link>
              <span className="flex-1 border-b"></span>
            </div>
          </div>
          {/* Right image - hidden on medium screens */}
          <img
            src="../../images/LoginPage.png"
            alt="Decorative right"
            className="opacity-50 h-full rotate-180 hidden lg:block"
          />
        </div>
      </div>
    </div >
  );
};

export default Login;