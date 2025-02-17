import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUser, FiTrash } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import ProperButtonBlack from '../components/ProperButtonBlack';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        navigate('/blogs');
      } catch (err) {
        console.error('Error deleting blog:', err);
        alert('Failed to delete blog');
      }
    }
  };

  if (loading) return <Loader />;

  if (!blog) return (
    <div className="text-center p-16">
      <h2 className="text-2xl mb-4">Blog post not found</h2>
      <p className="text-gray-600">The requested blog post could not be loaded.</p>
    </div>
  );

  return (
    <>
    <img src="../../images/embupsidedown.png" alt="" className='w-full h-auto opacity-50' />

    <div className="min-h-screen pt-10 px-4 md:px-8 pb-8">

      <div className="flex justify-between items-center px-4 md:px-8">
        <ProperButtonBlack
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
          text={<><FiArrowLeft /> Back</>}
        />
        {userInfo?.isAdmin && (
          <ProperButtonBlack
            onClick={handleDelete}
            className=" flex items-center gap-2 bg-[#d11a3eeb]"
            text={<><FiTrash /> Delete</>}
          />
        )}
      </div>

      <div className="w-full h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden shadow-xl mt-8 mb-12 md:my-12 animate-float">
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-400 ease-in-out"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/800x500?text=Image+Not+Available'
          }}
        />
      </div>

      <h1 className="font-serif text-3xl md:text-4xl text-gray-800 text-center mb-8 mx-auto max-w-4xl">
        {blog.title}
      </h1>

      <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 md:p-12 max-w-4xl mx-auto animate-fade-in">
        <div className="flex flex-wrap gap-6 text-gray-600 text-sm mb-8">
          <div className="flex items-center gap-2">
            <FiUser /> By {blog.author || 'Admin'}
          </div>
          <div className="flex items-center gap-2">
            <FiClock /> {Math.ceil(blog.content.length / 1000)} min read
          </div>
          <div>
            • {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        <div 
          className="text-gray-800 leading-relaxed text-lg space-y-4"
          dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
        />
      </div>
    </div>
    </>
  );
};

export default BlogDetail;