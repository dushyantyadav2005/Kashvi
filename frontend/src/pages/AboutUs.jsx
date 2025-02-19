// AboutUs.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: "ease-out",
            once: true,
        });
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-center align-center md:flex md:space-x-4">
                <div className="md:w-2/3">
                    <h2 className="text-4xl font-semibold mb-8 text-center font-playfair" data-aos="fade-up">
                        About Us
                    </h2>

                    {/* Mission Section */}
                    <div className="mb-8" data-aos="fade-up" data-aos-delay="200">
                        <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                        <p className="text-gray-700 text-lg">
                            At <span className="font-bold">Saree Haven</span>, our mission is to bring you the finest collection of sarees that celebrate tradition, elegance, and craftsmanship. We aim to make every woman feel special and confident in her choice of attire.
                        </p>
                    </div>

                    {/* Story Section */}
                    <div className="mb-8" data-aos="fade-up" data-aos-delay="400">
                        <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
                        <p className="text-gray-700 text-lg">
                            Founded in 2020, Saree Haven began as a small boutique with a passion for sarees. Over the years, we have grown into a trusted name, offering a curated collection of sarees for every occasion. Our journey is fueled by a love for tradition and a commitment to quality.
                        </p>
                    </div>

                    {/* Values Section */}
                    <div className="mb-8" data-aos="fade-up" data-aos-delay="600">
                        <h3 className="text-2xl font-semibold mb-4">Our Values</h3>
                        <ul className="list-disc list-inside text-gray-700 text-lg">
                            <li>Quality: We source only the finest materials for our sarees.</li>
                            <li>Tradition: We honor the rich heritage of saree craftsmanship.</li>
                            <li>Customer Satisfaction: Your happiness is our priority.</li>
                            <li>Innovation: We blend tradition with modern designs.</li>
                        </ul>
                    </div>

                    {/* Team Section */}
                    <div className="mb-8" data-aos="fade-up" data-aos-delay="800">
                        <h3 className="text-2xl font-semibold mb-4">Meet Our Team</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Team Member 1 */}
                            <div className="text-center">
                                <img
                                    src="../../public/team-member-1.jpg"
                                    alt="Team Member 1"
                                    className="w-full h-64 object-cover rounded-lg shadow-lg mb-4"
                                />
                                <h4 className="text-xl font-semibold">Priya Sharma</h4>
                                <p className="text-gray-600">Founder & CEO</p>
                            </div>

                            {/* Team Member 2 */}
                            <div className="text-center">
                                <img
                                    src="../../public/team-member-2.jpg"
                                    alt="Team Member 2"
                                    className="w-full h-64 object-cover rounded-lg shadow-lg mb-4"
                                />
                                <h4 className="text-xl font-semibold">Rahul Kapoor</h4>
                                <p className="text-gray-600">Creative Director</p>
                            </div>

                            {/* Team Member 3 */}
                            <div className="text-center">
                                <img
                                    src="../../public/team-member-3.jpg"
                                    alt="Team Member 3"
                                    className="w-full h-64 object-cover rounded-lg shadow-lg mb-4"
                                />
                                <h4 className="text-xl font-semibold">Anjali Mehta</h4>
                                <p className="text-gray-600">Head of Operations</p>
                            </div>
                        </div>
                    </div>

                    {/* Call-to-Action Section */}
                    <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="1000">
                        <h3 className="text-2xl font-semibold mb-4">Join Our Journey</h3>
                        <p className="text-gray-700 text-lg mb-6">
                            Explore our collection and discover the perfect saree for every occasion. Let us help you embrace the timeless beauty of sarees.
                        </p>
                        <Link
                            to="/shop"
                            className="bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition duration-300"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;