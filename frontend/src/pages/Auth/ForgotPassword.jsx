import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false); // Track loading state
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("ForgotPassword submitHandler called with email:", email);

        setLoading(true); // Start loading

        try {
            const response = await axios.post("http://localhost:5000/api/users/forgot-password", { email });
            console.log("Server response:", response.data);

            if (response.data.success) {
                toast.success("Password reset email sent!");
                navigate("/login");
            } else {
                toast.error("Failed to send password reset email.");
            }
        } catch (err) {
            console.error("Error occurred:", err);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="py-16">
            {loading ? <Loader /> : (
                <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                    <div className="w-full p-8 lg:w-1/2">
                        <h2 className="text-2xl font-semibold text-gray-700 text-center">
                            Forgot Password
                        </h2>
                        <p className="text-xl text-gray-600 text-center">
                            Enter your email to receive a reset link
                        </p>
                        <form onSubmit={submitHandler} className="mt-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email Address
                                </label>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                                    disabled={loading} // Disable button while loading
                                >
                                    {loading ? <Loader /> : "Send Reset Link"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
