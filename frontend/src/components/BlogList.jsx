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
    <div className="min-h-screen">
      <img src="../../images/embupsidedown.png" alt="" className='w-full h-auto opacity-50 mb-12' />

      <h1 className="text-center text-4xl mb-14 text-gray-900 relative font-playfair">
        Latest Saree Articles
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {blogs.map(blog => (
          <div 
            key={blog._id} 
            className="rounded-sm overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl group relative border-2 border-[#D4AF37] bg-[#5b0a1a] flex flex-col"
          >
            <div className="h-48 sm:h-64 md:h-80 lg:h-96 relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/400x250?text=Image+Not+Available'
                }}
              />
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl md:text-xl lg:text-2xl font-bold text-yellow-500 mb-4 transition-all duration-300 group-hover:text-yellow-400 font-playfair capitalize">
                {blog.title}
              </h2>
              <Link 
                to={`/blogs/${blog._id}`} 
                className="flex items-center text-yellow-500 font-semibold transition-all duration-300 group-hover:text-yellow-400 mt-auto"
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