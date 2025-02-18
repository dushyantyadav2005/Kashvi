import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import ProperButtonBlack from "../../components/ProperButtonBlack";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
    setPhone(userInfo.phone);
  }, [userInfo.email, userInfo.username, userInfo.phone]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
          phone,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[5rem] pt-6">
      <div className="flex justify-center overflow-hidden mx-auto max-w-lg border border-[#D4AF37]">
        <div className="w-full p-8">
          <h2 className="h4 text-center font-playfair m-10 mb-0 mt-0 text-4xl uppercase">Update</h2>
          <h2 className="h4 text-center font-montserrat m-10 mt-0 mb-10 text-sm uppercase">Profile</h2>
          
          <form onSubmit={submitHandler} className="mt-4 w-full">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <input
                type="email"
                className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
              <input
                type="tel"
                className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                minLength="10"
                maxLength="10"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <input
                type="password"
                className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <ProperButtonBlack
                type="submit"
                className="w-48"
                text={loadingUpdateProfile ? "Updating..." : "Update Profile"}
                disabled={loadingUpdateProfile}
              />
              
              <ProperButtonBlack
                as={Link}
                to="/user-orders"
                className="w-48"
                text="My Orders"
              />
            </div>
            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;