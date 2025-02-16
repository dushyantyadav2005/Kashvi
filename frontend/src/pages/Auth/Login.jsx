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
    <div className="py-6">
      <div className="flex justify-between items-center overflow-hidden mx-auto max-w-sm lg:max-w-3xl max-h-[85vh] border border-[#D4AF37]">
        <img src="../../images/LoginPage.png" alt="" className='h-full opacity-50' />

        <div className="w-full p-8 lg:w-1/2 flex flex-col justify-center items-center">
          <h2 className="h4 text-center font-playfair m-10 mb-0 mt-0 text-4xl uppercase">Login</h2>
          <h2 className="h4 text-center font-montserrat m-10 mt-0 mb-10 text-sm uppercase">your account</h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-gray-500 uppercase">
              login with email
            </span>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>
          <form onSubmit={submitHandler} className="mt-4 w-full">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-gray-500">
                  Forgot Password?
                </Link>
              </div>
              <input
                className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full"
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
                className="w-full"
                text={isLoading ? "Signing In..." : "Login"}
              >
                {isLoading ? "Signing In..." : "Login"}
              </ProperButtonBlack>
            </div>
            {isLoading && <Loader />}
          </form>

          <div className="mt-4 flex items-center justify-center space-x-2">
            <span className="flex-1 border-b"></span>
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-xs text-gray-500 uppercase"
            >
              or <b>sign up</b>
            </Link>
            <span className="flex-1 border-b"></span>
          </div>
        </div>
        <img src="../../images/LoginPage.png" alt="" className='opacity-50 rotate-180' />
      </div>
    </div >
  );
};

export default Login;