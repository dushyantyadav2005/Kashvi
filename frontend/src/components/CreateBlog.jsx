import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiImage, FiEdit, FiTag } from "react-icons/fi";
import { toast } from "react-toastify";
import ProperButtonBlack from "../components/ProperButtonBlack";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageName(file.name);
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadBlogImage(formData).unwrap();
      setImage(res.image);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      setImageName("");
      toast.error(err.data?.error || "Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !category || !image) {
      toast.error("All fields are required");
      return;
    }

    try {
      await createBlog({ title, content, category, image }).unwrap();
      toast.success("Blog created successfully!");
      
      setTimeout(() => {
        navigate("/blogs");
      }, 1500);
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
            className="flex items-center gap-2 mb-4 p-3 text-[#480815] " 
          >
            <FiArrowLeft /> Back to Blogs
          </button>

          <div className="p-3">
          <h2 className="h4 text-center font-playfair m-10 mb-0 text-4xl uppercase font-bold">Create New</h2>
          <h2 className="h4 text-center font-montserrat m-10 mt-0 text-xl uppercase">Blog Post</h2>

            {image && (
              <div className="text-center mb-4">
                <img
                  src={image}
                  alt="Preview"
                  className="block mx-auto w-full max-h-96 object-cover rounded-lg border border-[#480815]"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="text-black py-2 px-4 block w-full text-center rounded-lg cursor-pointer font-bold">
                {imageName || "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1">
                  <label htmlFor="title" className="block mb-2">Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full"
                    placeholder="Enter blog title"
                    maxLength={120}
                  />
                  <div className="text-gray-400 text-sm mt-1">
                    {title.length}/120
                  </div>
                </div>

                <div className="flex-1">
                  <label htmlFor="category" className="block mb-2">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full"
                  >
                    <option value="">Select a category</option>
                    <option value="styling">Saree Styling</option>
                    <option value="fabric-care">Fabric Care</option>
                    <option value="fashion-trends">Fashion Trends</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="content" className="block mb-2">Content</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 block w-full"
                  placeholder="Write your blog content..."
                  maxLength={2000}
                />
                <div className="text-gray-400 text-sm mt-1">
                  {content.length}/2000
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <ProperButtonBlack text="Create Blog" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;