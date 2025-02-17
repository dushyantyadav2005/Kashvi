import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowRight } from 'react-icons/fi';
import Loader from "../components/Loader";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blogs');
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className=" min-h-screen">
            <img src="../../images/embupsidedown.png" alt="" className='w-full h-auto opacity-50 mb-12' />

      <h1 className="text-center text-4xl mb-14 text-gray-900 relative font-playfair">
        Latest Saree Articles
        {/* <span className="absolute bottom-[-0.75rem] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#D4AF37]"></span> */}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {blogs.map(blog => (
          <div 
            key={blog._id} 
            className="rounded-sm overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl group relative border-2 border-[#D4AF37] bg-[#5b0a1a] transform hover:-translate-y-2"
          >
            <div className="h-64 relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/400x250?text=Image+Not+Available'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#470815da] to-transparent opacity-40 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 relative z-10">
              <span
                className={`text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4 inline-block shadow-md transition-all duration-300 ${
                  blog.category === 'styling' ? 'bg-[#D4AF37]' :
                  blog.category === 'fabric-care' ? 'bg-[#24110c]' :
                  blog.category === 'fashion-trends' ? 'bg-[#800e25d2]' :
                  'bg-[#D4AF37]'
                }`}
              >
                {blog.category.replace('-', ' ')}
              </span>
              <h2 className="text-xl font-bold text-yellow-500 mb-4 transition-all duration-300 group-hover:text-yellow-400 font-playfair capitalize">{blog.title}</h2>
              <p className="text-gray-300 leading-relaxed mb-6 line-clamp-3 transition-all duration-300 group-hover:text-gray-500 ">
                {blog.content.substring(0, 120)}...
              </p>
              <Link 
                to={`/blogs/${blog._id}`} 
                className="flex items-center text-yellow-500 font-semibold transition-all duration-300 group-hover:text-yellow-400"
              >
                Continue Reading
                <FiArrowRight className="ml-2 transition-all duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;