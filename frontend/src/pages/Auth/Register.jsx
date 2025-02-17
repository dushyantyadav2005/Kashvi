 // Start of Selection
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
     <div className="py-6">
       <div className="flex justify-between items-center overflow-hidden mx-auto max-w-sm lg:max-w-3xl max-h-[85vh] border border-[#D4AF37]">
      <img src="../../images/LoginPage.png" alt="" className=' h-full opacity-50' />
         
         <div className="w-full p-8 lg:w-1/2 flex flex-col justify-center items-center ">
           <h2 className="h4 text-center font-playfair m-10 mb-0 mt-0 text-4xl uppercase">CREATE</h2>
           <h2 className="h4 text-center font-montserrat m-10 mt-0 mb-3 text-lg uppercase">an account</h2>
           <div className="mt-4 flex items-center justify-between">
           <span className="border-b w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-gray-500 uppercase">

            </span>
            <span className="border-b w-1/5 lg:w-1/4"></span>
           </div>

           {/* Loader displayed on the page */}
           {(isRegistering || isVerifying) && (
             <div className="flex justify-center my-2">
               <Loader />
             </div>
           )}

           <form onSubmit={submitHandler} className="mt-4 w-full">
             <div>
               <label className="block text-gray-700 text-sm font-bold mb-2">
                 Name
               </label>
               <input
                 type="text"
                 className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815]  py-2 px-4 block w-full"
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
                 className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815]  py-2 px-4 block w-full"
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
                 className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815]  py-2 px-4 block w-full"
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
                 className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815]  py-2 px-4 block w-full"
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
                 className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815]  py-2 px-4 block w-full"
                 placeholder="Confirm password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 disabled={isRegistering || isVerifying}
               />
             </div>
             <div className="mt-8">
               <ProperButtonBlack
                 type="submit"
                 text={isRegistering || isVerifying ? "Signing Up..." : "Register"}
                 className="w-full"
                 disabled={isRegistering || isVerifying}
                 aria-label={isRegistering || isVerifying ? "Loading..." : "Register"}
                 aria-disabled={isRegistering || isVerifying}
               >
               </ProperButtonBlack>
             </div>
           </form>
           <div className="mt-4 flex items-center justify-between w-full">
             <span className="border-b w-1/5 md:w-1/4"></span>
             <Link
               to={redirect ? `/login?redirect=${redirect}` : "/login"}
               className="text-xs text-gray-500 uppercase"
             >
               or <b>login</b>
             </Link>
             <span className="border-b w-1/5 md:w-1/4"></span>
           </div>
         </div>
      <img src="../../images/LoginPage.png" alt="" className=' opacity-50 rotate-180' />

       </div>
     </div> 
   );
 };

 export default Register;