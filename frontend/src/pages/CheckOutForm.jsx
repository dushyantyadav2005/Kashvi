import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { faker } from "@faker-js/faker";
import Loader from "../components/Loader";
import { useProfileMutation } from "../redux/api/usersApiSlice";
import { useCreateOrderMutation } from "../redux/api/orderApiSlice";
import { setCredentials } from "../redux/features/auth/authSlice";
import ProperButtonBlack from "../components/ProperButtonBlack";




const CheckoutForm = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart || []);

    const [username, setUserName] = useState(userInfo?.username || "");
    const [email, setEmail] = useState(userInfo?.email || "");
    const [phone, setPhone] = useState(userInfo?.phone || "");
    const [street, setStreet] = useState(userInfo?.address?.street || "");
    const [city, setCity] = useState(userInfo?.address?.city || "");
    const [state, setState] = useState(userInfo?.address?.state || "");
    const [pin, setPin] = useState(userInfo?.address?.pin || "");
    const [loadingInvoice, setLoadingInvoice] = useState(false);

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
    const [createOrder, { isLoading: loadingCreateProduct }] = useCreateOrderMutation();

    // Combine address fields into a single string
    const combineAddress = () => {
        return `${street}, ${city}, ${state}, ${pin}`;
    };

    const submitHandler = async (e) => {
        if (!username || !email || !phone || !street || !city || !state || !pin) {
            toast.error("All fields are required.");
            return;
        }
        const orderItems = cartItems.map((product) => ({
            name: product.name,
            qty: product.qty,
            image: product.image,
            product: product._id, // Assuming `_id` is the product ID
        }));
        e.preventDefault();

        setLoadingInvoice(true);

        try {
            // Combine address fields into a single string
            const fullAddress = combineAddress();

            // Update user profile with the combined address
            const res = await updateProfile({
                _id: userInfo._id,
                username,
                email,
                phone,
                address: fullAddress,
            }).unwrap();

            dispatch(setCredentials({ userInfo: res }));

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            };

            const res_order = await createOrder({
                _id: userInfo._id,
                orderItems: orderItems,
                shippingAddress: {
                    street: street,
                    city: city,
                    postalCode: pin
                }
            })

            // dispatch()
            // Send invoice data to the backend
            const response = await axios.post(
                "http://localhost:5000/api/invoice",
                {
                    invoiceNo: faker.string.alphanumeric(10).toUpperCase(),
                    email: userInfo?.email || "N/A",
                    customerName: userInfo?.username || "Guest",
                    items: cartItems.map((item) => ({
                        name: item.name,
                        qty: item.qty,
                    })),
                    address: fullAddress, // Send the combined address
                },
                config
            );

            if (response.data && response.data.message) {
                toast.success("Invoice generated successfully! Check your email for details.");
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to generate invoice. Please try again.");
        } finally {
            setLoadingInvoice(false);
        }
    };

    if (loadingUpdateProfile || loadingInvoice) {
        return <Loader />;
    }

    return (
        <section className="py-8 bg-gray-900 md:py-16">
            <form className="mx-auto max-w-screen-xl px-4 2xl:px-0" onSubmit={submitHandler}>
                <div className="mt-6 sm:mt-8">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Details</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={username}
                                        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="John Doe"
                                        required
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="name@example.com"
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Phone Number*</label>
                                    <input
                                        type="text"
                                        value={phone}
                                        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="123-456-7890"
                                        minLength={10}
                                        maxLength={10}
                                        required
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Street</label>
                                    <input
                                        type="text"
                                        value={street}
                                        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="1234 Main St"
                                        required
                                        onChange={(e) => setStreet(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">City</label>
                                    <input
                                        type="text"
                                        value={city}
                                        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="City"
                                        required
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">State</label>
                                    <input
                                        type="text"
                                        value={state}
                                        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="State"
                                        required
                                        onChange={(e) => setState(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">PIN Code</label>
                                    <input
                                        type="text"
                                        value={pin}
                                        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="123456"
                                        minLength={6}
                                        maxLength={6}
                                        required
                                        onChange={(e) => setPin(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <ProperButtonBlack
                                type="submit"
                                className="w-48"
                                text={loadingUpdateProfile || loadingInvoice ? <span className="loader"></span> : "Generate Invoice"}
                                disabled={loadingUpdateProfile || loadingInvoice}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default CheckoutForm;