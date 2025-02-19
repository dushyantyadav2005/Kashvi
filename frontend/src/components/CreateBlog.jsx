import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateBlogMutation } from "../redux/api/blogApiSlice";
import ProperButtonBlack from "../components/ProperButtonBlack";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const [createBlog, { isLoading }] = useCreateBlogMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category || !imageUrl) {
      toast.error("All fields are required");
      return;
    }
    try {
      await createBlog({ title, content, category, image: imageUrl }).unwrap();
      toast.success("Blog created successfully!");
      setTimeout(() => navigate("/blogs"), 1500);
    } catch (err) {
      toast.error(err.data?.error || "Failed to create blog");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-center text-3xl font-playfair font-medium mt-5">CREATE</h2>
          <h2 className="text-center font-montserrat uppercase tracking-wider text-lg mb-8">Blog Post</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
              <input
                type="text"
                className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
              />
              {imageUrl && (
                <div className="mt-4 text-center">
                  <img src={imageUrl} alt="Preview" className="mx-auto max-h-[200px] border-2 border-[#D4AF37] shadow-lg rounded-lg" />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <select
                className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="styling">Saree Styling</option>
                <option value="fabric-care">Fabric Care</option>
                <option value="fashion-trends">Fashion Trends</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Content</label>
              <textarea
                className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 h-64"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content..."
              />
            </div>

            <ProperButtonBlack
              type="submit"
              text={isLoading ? "Creating..." : "Submit"}
              className="w-full md:w-auto py-3 px-8 mt-6"
              disabled={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
