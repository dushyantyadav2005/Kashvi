import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation, useVerifyEmailMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const redirect = "/otp";

  const validateInputs = () => {
    if (!username || !email || !phone || !password || !confirmPassword) {
      toast.error("All fields are required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (phone.length !== 10 || isNaN(phone)) {
      toast.error("Phone number must be 10 digits");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email address");
      return false;
    }
    return true;
  };

  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (strongRegex.test(password)) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const res_register = await register({ username, email, phone, password }).unwrap();
      dispatch(setCredentials({ userInfo: res_register, isVerified: false }));
      const res_verify = await verifyEmail({ email }).unwrap();
      console.log(res_verify);
      toast.success(res_verify.message);
      navigate(redirect);
    } catch (err) {
      console.log(err);
      toast.error(err.data?.message || "An error occurred");
    }
  };

  return (
    <div className="py-16">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80')",
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Kashvi
          </h2>
          <p className="text-xl text-gray-600 text-center">Create an account</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <a href="#" className="text-xs text-center text-gray-500 uppercase">
              or sign up with email
            </a>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>

          {/* Loader displayed on the page */}
          {(isRegistering || isVerifying) && (
            <div className="flex justify-center my-4">
              <Loader />
            </div>
          )}

          <form onSubmit={submitHandler} className="mt-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                placeholder="Enter name"
                value={username}
                onChange={(e) => setName(e.target.value)}
                disabled={isRegistering || isVerifying}
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isRegistering || isVerifying}
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone No
              </label>
              <input
                type="tel"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                placeholder="Enter Phone No"
                value={phone}
                minLength="10"
                maxLength="10"
                onChange={(e) => setPhone(e.target.value)}
                disabled={isRegistering || isVerifying}
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                disabled={isRegistering || isVerifying}
              />
              {passwordStrength && <p className="text-sm mt-1">Password Strength: {passwordStrength}</p>}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isRegistering || isVerifying}
              />
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                disabled={isRegistering || isVerifying}
                aria-label={isRegistering || isVerifying ? "Loading..." : "Register"}
                aria-disabled={isRegistering || isVerifying}
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-xs text-gray-500 uppercase"
            >
              or login
            </Link>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;