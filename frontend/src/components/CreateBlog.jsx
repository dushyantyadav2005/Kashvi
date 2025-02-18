import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiImage, FiEdit, FiTag } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCreateBlogMutation } from "../redux/api/blogApiSlice";

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
      await createBlog({
        title,
        content,
        category,
        image: imageUrl
      }).unwrap();

      toast.success("Blog created successfully!");
      setTimeout(() => navigate("/blogs"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.data?.error || "Failed to create blog");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0] min-h-screen">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/4 p-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 p-3 text-[#480815] hover:text-[#D4AF37] transition-colors duration-200"
          >
            <FiArrowLeft /> Back to Blogs
          </button>

          <div className="p-3">
            <h2 className="h4 text-center font-playfair m-10 mb-0 text-4xl uppercase font-bold">Create New</h2>
            <h2 className="h4 text-center font-montserrat m-10 mt-0 text-xl uppercase">Blog Post</h2>

            {/* Changed only the image upload section */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-[#480815]">
                Featured Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-[#f8f8f8] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border-2 border-[#480815]/20 rounded-lg py-3 px-4 block w-full transition-colors duration-200"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              />
              {imageUrl && (
                <div className="mt-4 text-center">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="mx-auto max-w-full h-96 object-contain rounded-lg border-2 border-[#D4AF37] shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Rest of the form remains EXACTLY the same */}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1">
                  <label htmlFor="title" className="block mb-2 font-medium text-[#480815]">Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#f8f8f8] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border-2 border-[#480815]/20 rounded-lg py-3 px-4 block w-full transition-colors duration-200"
                    placeholder="Enter blog title"
                    maxLength={120}
                  />
                  <div className="text-gray-400 text-sm mt-1">
                    {title.length}/120
                  </div>
                </div>

                <div className="flex-1">
                  <label htmlFor="category" className="block mb-2 font-medium text-[#480815]">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-[#f8f8f8] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border-2 border-[#480815]/20 rounded-lg py-3 px-4 block w-full appearance-none transition-colors duration-200"
                  >
                    <option value="">Select a category</option>
                    <option value="styling">Saree Styling</option>
                    <option value="fabric-care">Fabric Care</option>
                    <option value="fashion-trends">Fashion Trends</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block mb-2 font-medium text-[#480815]">Content</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-[#f8f8f8] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border-2 border-[#480815]/20 rounded-lg py-3 px-4 block w-full h-64 resize-none transition-colors duration-200"
                  placeholder="Write your blog content..."
                  maxLength={2000}
                />
                <div className="text-gray-400 text-sm mt-1">
                  {content.length}/2000
                </div>
              </div>

              <div className="flex gap-4 mt-8 justify-end">
                <button
                  type="submit"
                  className="bg-[#480815] text-white px-8 py-3 rounded-lg hover:bg-[#D4AF37] transition-colors duration-200 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;