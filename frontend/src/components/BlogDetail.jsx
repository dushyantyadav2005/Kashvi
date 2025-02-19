import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiUser, FiTrash } from "react-icons/fi";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import ProperButtonBlack from "../components/ProperButtonBlack";

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
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        navigate("/blogs");
      } catch (err) {
        console.error("Error deleting blog:", err);
        alert("Failed to delete blog");
      }
    }
  };

  if (loading) return <Loader />;
  if (!blog)
    return (
      <div className="text-center p-16">
        <h2 className="text-2xl mb-4 font-semibold">Blog post not found</h2>
        <p className="text-gray-600">The requested blog post could not be loaded.</p>
      </div>
    );

  return (
    <div className="min-h-screen pt-10 px-4 md:px-12 pb-12 animate-fade-in">
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-6">
        <ProperButtonBlack
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
          text={
            <>
              <FiArrowLeft /> Back
            </>
          }
        />
        {userInfo?.isAdmin && (
          <ProperButtonBlack
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-all duration-200 hover:scale-105"
            text={
              <>
                <FiTrash /> Delete
              </>
            }
          />
        )}
      </div>

      {/* Main Blog Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Side: Image */}
        <div className="w-full h-[60vh] rounded-3xl overflow-hidden shadow-2xl transform transition duration-500 hover:scale-105">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/800x500?text=Image+Not+Available";
            }}
          />
        </div>

        {/* Right Side: Blog Details */}
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Title */}
          <h1 className="font-serif text-3xl md:text-5xl text-gray-900 font-bold leading-tight">
            {blog.title}
          </h1>

          {/* Blog Info */}
          <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <FiUser className="text-gray-500" /> By {blog.author || "Admin"}
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-gray-500" /> {Math.ceil(blog.content.length / 1000)} min read
            </div>
            <div>
              • {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Blog Content */}
          <div className="bg-white bg-opacity-90 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-3xl">
            <div
              className="text-gray-800 leading-relaxed text-lg space-y-6"
              dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, "<br />") }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
