const Footer = () => {
    return (
        <footer className="bg-[#480815] text-[#efdcd9]">
            {/* Top Section with Logo and Newsletter */}
            <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center border-b border-[#D4AF37]">
                {/* Logo */}
                <div className="mb-4 md:mb-0">
                    <img
                        src={'/logopng.png'}
                        alt="Vedanti Logo"
                        className="h-12 w-auto"
                    />
                </div>
  
                {/* Newsletter */}
                <div className="w-full md:w-auto">
                    <form className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Subscribe to our Newsletter"
                            className="w-full md:w-64 px-4 py-2 text-[#800e25] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#D4AF37] text-[#800e25] font-medium rounded-r-md hover:bg-[#e3af03] transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
  
            {/* Existing Footer Content */}
            <div className="p-8">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {/* Categories Section */}
                    <div>
                        <h3 className="font-bold mb-4">CATEGORIES</h3>
                        <ul className="space-y-2 text-sm">
                            {['Benarsi', 'Kanjivaram', 'Paithani', 'Wedding Saree',
                                'Festive', 'Georgette', 'Net']
                                .map((item) => (
                                    <li key={item}>
                                        <a href="#" className="relative inline-block hover:text-[#D4AF37] transition-colors
                        before:content-[''] before:absolute before:left-0 before:-bottom-1 
                        before:w-0 before:h-px before:bg-[#D4AF37] 
                        before:transition-all before:duration-300 hover:before:w-full">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    </div>
  
                    {/* Support Section */}
                    <div>
                        <h3 className="font-bold mb-4">SUPPORT</h3>
                        <ul className="space-y-2 text-sm">
                            {['Track Order', 'Contact Us', 'My Account'].map((item) => (
                                <li key={item}>
                                    {item === 'Track Order' && (
                                        <a href="/trackorder" className="relative inline-block hover:text-yellow-300 transition-colors
                                            before:content-[''] before:absolute before:left-0 before:-bottom-1 
                                            before:w-0 before:h-px before:bg-yellow-300 
                                            before:transition-all before:duration-300 hover:before:w-full">
                                            {item}
                                        </a>
                                    )}
                                    {item === 'Contact Us' && (
                                        <a href="/contact" className="relative inline-block hover:text-yellow-300 transition-colors
                                            before:content-[''] before:absolute before:left-0 before:-bottom-1 
                                            before:w-0 before:h-px before:bg-yellow-300 
                                            before:transition-all before:duration-300 hover:before:w-full">
                                            {item}
                                        </a>
                                    )}
                                    {item === 'My Account' && (
                                        <a href="#" className="relative inline-block hover:text-yellow-300 transition-colors
                                            before:content-[''] before:absolute before:left-0 before:-bottom-1 
                                            before:w-0 before:h-px before:bg-yellow-300 
                                            before:transition-all before:duration-300 hover:before:w-full">
                                            {item}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
  
                    {/* Quick Links Section */}
                    <div>
                        <h3 className="font-bold mb-4">QUICK LINKS</h3>
                        <ul className="space-y-2 text-sm">
                            {['About Us', 'Blogs', 'Store Locator'].map((item) => (
                                <li key={item}>
                                    {item === 'About Us' && (
                                        <a href="/about" className="relative inline-block hover:text-yellow-300 transition-colors
                                            before:content-[''] before:absolute before:left-0 before:-bottom-1 
                                            before:w-0 before:h-px before:bg-yellow-300 
                                            before:transition-all before:duration-300 hover:before:w-full">
                                            {item}
                                        </a>
                                    )}
                                    {item === 'Blogs' && (
                                        <a href="/blogs" className="relative inline-block hover:text-yellow-300 transition-colors
                                            before:content-[''] before:absolute before:left-0 before:-bottom-1 
                                            before:w-0 before:h-px before:bg-yellow-300 
                                            before:transition-all before:duration-300 hover:before:w-full">
                                            {item}
                                        </a>
                                    )}
                                    {item === 'Store Locator' && (
                                        <a href="#" className="relative inline-block hover:text-yellow-300 transition-colors
                                            before:content-[''] before:absolute before:left-0 before:-bottom-1 
                                            before:w-0 before:h-px before:bg-yellow-300 
                                            before:transition-all before:duration-300 hover:before:w-full">
                                            {item}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
  
                    {/* Our Policies Section */}
                    <div>
              <h3 className="font-bold mb-4">OUR POLICIES</h3>
              <ul className="space-y-2 text-sm">
                {['FAQs', 'Return, Exchange and Refund Policy', 
                  'Terms of Use', 'Privacy Policy'].map((item) => (
                    <li key={item}>
                      <a href={item === 'FAQs' ? '/faq' : '#'} className="relative inline-block hover:text-yellow-300 transition-colors
                        before:content-[''] before:absolute before:left-0 before:-bottom-1 
                        before:w-0 before:h-px before:bg-yellow-300 
                        before:transition-all before:duration-300 hover:before:w-full">
                        {item}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
  
                    {/* Contact Section */}
                    <div>
                        <h3 className="font-bold mb-4">CONTACT</h3>
                        <div className="space-y-2 text-sm">
                            <p>
                                <a href="mailto:cavs@vodantitashions.com" className="relative inline-block hover:text-[#D4AF37] transition-colors
                    before:content-[''] before:absolute before:left-0 before:-bottom-1 
                    before:w-0 before:h-px before:bg-[#D4AF37] 
                    before:transition-all before:duration-300 hover:before:w-full">
                                    kashvicreation10@gmail.com
                                </a>
                            </p>
                            <p className="mt-2">
                                Call us at :<br />
                                +91 9376421333 (Vimal Jain)<br />
                                +91 7290909696 (Manoj Kejriwal)
                            </p>
                            <p className="mt-2">10 am - 7 pm, Monday - Saturday</p>
                        </div>
                    </div>
                </div>
  
                {/* Keep in Touch Section */}
                <div className="max-w-7xl mx-auto mt-8 border-t border-[#D4AF37] pt-8">
                    <h3 className="font-bold mb-4">KEEP IN TOUCH</h3>
                    <div className="flex gap-4">
                        {['f', 'v', '@', 'in', 'à', '@'].map((icon, index) => (
                            <a
                                key={index}
                                href="#"
                                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center
                    hover:bg-[#D4AF37] hover:text-[#800e25] transition-colors"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
  
                {/* Bottom Section */}
                <div className="flex flex-row max-w-7xl mx-auto mt-8 text-sm text-center md:text-left">
                    {/* <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                        {['FedEx.', 'BLUE DART', 'DELIHUETY'].map((carrier) => (
                            <span key={carrier}>{carrier}</span>
                        ))}
                    </div> */}
                    <div>© 2023 Kashvi Creations Fashion Ltd. All rights reserved.</div>
                </div>
            </div>
        </footer>
    );
  };
  
  export default Footer;