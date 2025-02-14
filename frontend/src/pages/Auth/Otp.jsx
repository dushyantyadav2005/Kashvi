import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useVerifyOTPMutation } from "../../redux/api/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setVerified } from "../../redux/features/auth/authSlice";

function Otp() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const email = useSelector((state) => state.auth.userInfo?.email || "");
    const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
    const navigate = useNavigate();
    const isCertified = useSelector((state) => state.auth.userInfo?.isCertified || false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isCertified) {
            toast.info("You are already verified.");
            navigate("/"); // Redirect to home or another page
        }
    }, [isCertified, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            newOtp[index] = "";

            if (index > 0) {
                newOtp[index - 1] = "";
                setOtp(newOtp);
                e.target.previousSibling.focus();
            } else {
                setOtp(newOtp);
            }
        }
    };

    const handleVerifyOTP = async () => {
        if (isCertified) {
            toast.info("You are already verified.");
            return;
        }

        if (!email) {
            toast.error("User email is missing. Please log in again.");
            return;
        }

        if (otp.some((digit) => digit === "")) {
            toast.error("Please fill all OTP fields");
            return;
        }

        const otpString = otp.join("");
        try {
            const res_verify = await verifyOTP({ email, otp: otpString }).unwrap();
            console.log(res_verify);
            dispatch(setVerified(true));
            toast.success(res_verify.message);
            navigate("/"); // Redirect after successful verification
        } catch (err) {
            console.log(err);
            toast.error(err.data?.message || "An error occurred");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Enter OTP</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyOTP();
                }}
                className="flex flex-col items-center"
            >
                <div className="flex space-x-2">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onFocus={(e) => e.target.select()}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                </div>
                <button
                    type="submit"
                    disabled={isVerifying}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {isVerifying ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </div>
    );
}

export default Otp;
