import React from "react";
import ProperButtonBlack from "../components/ProperButtonBlack";
import { toast } from "react-toastify";

function Contact() {
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        try {
            const response = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success("Feedback submitted successfully!");
                e.target.reset();
            } else {
                toast.error("Failed to submit feedback.");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toast.error("An error occurred while submitting your feedback.");
        }
    };

    return (
        <section className="text-gray-600 body-font relative flex flex-col items-center min-h-screen">
            {/* Hero Image */}
            <img src="../../images/embupsidedown.png" alt="" className="w-full h-auto opacity-50 mb-9" />

            <div className="container px-6 py-8 md:py-12 mx-auto">
                <div className="flex flex-wrap md:justify-between">
                    {/* Left Section - Map & Address */}
                    <div className="w-full lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden shadow-lg p-6 relative">
                        {/* Google Map */}
                        <iframe
                            width="100%"
                            height="300"
                            className="rounded-lg"
                            frameBorder="0"
                            title="map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.940537630834!2d72.83923607471885!3d21.19452098206566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e50c564b04b%3A0x459c1c4b94f110f8!2sKashvi%20Sarees!5e0!3m2!1sen!2sin!4v1739452514594!5m2!1sen!2sin"
                            allowFullScreen
                        ></iframe>

                        {/* Address & Contact Details */}
                        <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
                            <h2 className="text-xs font-semibold text-gray-900 tracking-widest">ADDRESS</h2>
                            <p className="mt-1"><b>Sales Office:</b> Shop No. 113, Millennium Textile Market-2, Ring Road, Surat-395002</p>
                            <p className="mt-1"><b>Head Office:</b> Shop No. 6115 To 6124, Millennium Textile Market-4, Bhathena, Surat-395002</p>

                            <h2 className="text-xs font-semibold text-gray-900 tracking-widest mt-4">EMAIL</h2>
                            <a href="mailto:kashvicreation10@gmail.com" className="text-red-500 leading-relaxed">
                                kashvicreation10@gmail.com
                            </a>

                            <h2 className="text-xs font-semibold text-gray-900 tracking-widest mt-4">PHONE</h2>
                            <p className="leading-relaxed"><b>Vimal Jain:</b> 9376421333</p>
                            <p className="leading-relaxed"><b>Manoj Kejriwal:</b> 7290909696</p>
                        </div>
                    </div>

                    {/* Right Section - Feedback Form */}
                    <div className="w-full lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:pb-6 pt-0 mt-8 md:mt-0 justify-center p-6 rounded-lg shadow-lg">
                        <h2 className="text-center font-playfair m-4 mb-0 mt-0 text-4xl uppercase text-maroon-600">FEEDBACK</h2>
                        <h3 className="text-center font-montserrat m-4 mt-0 mb-3 text-lg uppercase text-maroon-800">FORM</h3>

                        {/* Description Text */}
                        <p className="text-center text-gray-600 text-sm md:text-base px-4 mb-6">
                            We value your feedback! Let us know your thoughts, suggestions, or any concerns.
                            Your input helps us improve and serve you better.
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div className="relative mb-4">
                                <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full rounded-md"
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div className="relative mb-4">
                                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full rounded-md"
                                    required
                                />
                            </div>

                            {/* Message Field */}
                            <div className="relative mb-4">
                                <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full rounded-md"
                                    required
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center">
                                <ProperButtonBlack text="Submit" className="mt-4 w-full  text-white py-2 rounded-md shadow-md hover:bg-[#6a1a2b] transition-all" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;
