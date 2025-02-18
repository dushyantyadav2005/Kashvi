import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation, useVerifyEmailMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import ProperButtonBlack from "../../components/ProperButtonBlack";

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
    const strongRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
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
      toast.success(res_verify.message);
      navigate(redirect);
    } catch (err) {
      console.log(err);
      toast.error(err.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-6 px-4 sm:px-6 md:py-8">
      <div className="flex-grow flex items-center justify-center">
        <div className="flex justify-between items-center mx-auto w-full max-w-md md:max-w-xl lg:max-w-4xl border border-[#D4AF37] rounded-lg bg-white shadow-lg">
          {/* Left image - hidden on medium screens */}
          <img 
            src="../../images/LoginPage.png" 
            alt="Decorative left" 
            className="h-full opacity-50 hidden lg:block" 
          />

          <div className="w-full p-6 md:p-8 lg:w-1/2 flex flex-col justify-center items-center">
            <h2 className="text-3xl md:text-4xl text-center font-playfair mb-2 uppercase">
              CREATE
            </h2>
            <h3 className="text-lg md:text-xl text-center font-montserrat mb-6 md:mb-8 uppercase">
              your account
            </h3>

            {(isRegistering || isVerifying) && (
              <div className="flex justify-center my-2">
                <Loader />
              </div>
            )}

            <form onSubmit={submitHandler} className="w-full mt-4 space-y-6">
              <div>
                <label className="block text-sm md:text-base font-semibold mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full py-3 px-4 border border-[#480815] bg-[#c3183a16] 
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                           text-base md:text-lg"
                  placeholder="Enter your full name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isRegistering || isVerifying}
                />
              </div>

              <div>
                <label className="block text-sm md:text-base font-semibold mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full py-3 px-4 border border-[#480815] bg-[#c3183a16] 
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                           text-base md:text-lg"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isRegistering || isVerifying}
                />
              </div>

              <div>
                <label className="block text-sm md:text-base font-semibold mb-3">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full py-3 px-4 border border-[#480815] bg-[#c3183a16] 
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                           text-base md:text-lg"
                  placeholder="Enter phone number"
                  value={phone}
                  minLength="10"
                  maxLength="10"
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isRegistering || isVerifying}
                />
              </div>

              <div>
                <label className="block text-sm md:text-base font-semibold mb-3">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full py-3 px-4 border border-[#480815] bg-[#c3183a16] 
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                           text-base md:text-lg"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                  disabled={isRegistering || isVerifying}
                />
                {passwordStrength && (
                  <p className={`text-sm mt-2 ${
                    passwordStrength === "Strong" ? "text-green-600" : "text-red-600"
                  }`}>
                    Password Strength: {passwordStrength}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm md:text-base font-semibold mb-3">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full py-3 px-4 border border-[#480815] bg-[#c3183a16] 
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                           text-base md:text-lg"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isRegistering || isVerifying}
                />
              </div>

              <div className="mt-8">
                <ProperButtonBlack
                  type="submit"
                  className="w-full py-3 text-lg md:text-xl"
                  disabled={isRegistering || isVerifying}
                >
                  {isRegistering || isVerifying ? "Creating Account..." : "Register Now"}
                </ProperButtonBlack>
              </div>
            </form>

            <div className="w-full mt-8 flex items-center justify-center space-x-2">
              <span className="flex-1 border-b"></span>
              <Link
                to={redirect ? "/login?redirect=${redirect}" : "/login"}
                className="text-sm text-gray-500 uppercase hover:text-[#D4AF37]"
              >
                Already have an account? <b className="text-[#D4AF37]">Login</b>
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
    </div>
  );
};

export default Register;