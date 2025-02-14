import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams(); // Get the token from the URL
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("ResetPassword submitHandler called");

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setIsLoading(true);
        try {
            const response = await axios.put(`/api/users/reset-password/${token}`, {
                password,
            });
            setIsLoading(false);
            if (response.data.success) {
                toast.success("Password has been reset successfully!");
                navigate("/login"); // Redirect to login page after successful reset
            } else {
                toast.error("Failed to reset password.");
            }
        } catch (err) {
            console.error("Error occurred:", err);
            toast.error(err.message);
            setIsLoading(false);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-16">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                    <div className="w-full p-8 lg:w-1/2">
                        <h2 className="text-2xl font-semibold text-gray-700 text-center">
                            Reset Password
                        </h2>
                        <p className="text-xl text-gray-600 text-center">
                            Enter your new password below
                        </p>
                        <form onSubmit={submitHandler} className="mt-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    New Password
                                </label>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
