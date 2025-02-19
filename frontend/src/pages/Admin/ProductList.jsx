import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import ProperButtonBlack from "../../components/ProperButtonBlack";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [designNumber, setDesignNumber] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [festival, setFestival] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [tags, setTags] = useState("");
  const navigate = useNavigate();
  const formRef = useRef();

  // Loading states for asynchronous operations
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreatingProduct(true); // Start loading
    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("designNumber", designNumber);
      productData.append("category", category || categories[0]._id);
      productData.append("quantity", quantity);
      productData.append("festival", festival);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      toast.error("Product create failed. Try Again.");
    } finally {
      setIsCreatingProduct(false); // Stop loading
    }
  };

  const handleDescription = async () => {
    setIsGeneratingDescription(true); // Start loading
    try {
      const tagsList = [...tags.split(',').map(tag => tag.trim()), name, festival].filter(tag => tag !== '');
      const response = await fetch('http://localhost:8002/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: tagsList, use_gemini: true }),
      });
      if (!response.ok) throw new Error('Failed to generate description');
      setDescription((await response.json()).description);
      toast.success('Description generated successfully');
    } catch (error) {
      toast.error('Failed to generate description');
    } finally {
      setIsGeneratingDescription(false); // Stop loading
    }
  };

  const handleTagGeneration = async (file) => {
    setIsGeneratingTags(true); // Start loading
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('http://localhost:8001/upload-image', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed to generate tags');
      setTags((await response.json()).tags.join(', '));
      toast.success('Tags generated successfully');
    } catch (error) {
      toast.error('Failed to generate tags');
    } finally {
      setIsGeneratingTags(false); // Stop loading
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingImage(true); // Start loading
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadProductImage(formData).unwrap();
      setIsUploadingImage(false); // Stop loading
      setImage(res.image);
      setImageUrl(res.image);
      setIsGeneratingTags(true);
      await handleTagGeneration(file);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6">
        <AdminMenu />
        <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-center text-3xl font-playfair font-medium mb-2">CREATE</h2>
          <h2 className="text-center font-montserrat uppercase tracking-wider text-lg mb-8">Product</h2>

          {imageUrl && (
            <div className="text-center mb-6">
              <img src={imageUrl} alt="product" className="mx-auto max-h-[200px]" />
            </div>
          )}

          <form onSubmit={handleSubmit} ref={formRef}>
            <div className="mb-6">
              <label className="block border border-[#480815] px-4 py-6 text-center cursor-pointer font-bold">
                {isUploadingImage || isGeneratingTags ? (
                  <div className="flex items-center justify-center">
                    <div className="loader"></div> {/* CSS loader */}
                    <span className="ml-2">{isUploadingImage ? "Uploading Image...." : "Generating Tags"}</span>
                  </div>
                ) : (
                  image ? image.name : "Upload Image"
                )}
                <input type="file" name="image" accept="image/*" onChange={uploadFileHandler} className="hidden" />
              </label>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Design Number</label>
                  <input
                    type="text"
                    className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4"
                    value={designNumber}
                    onChange={(e) => setDesignNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                  <input
                    type="number"
                    className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Festival</label>
                  <input
                    type="text"
                    className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4"
                    value={festival}
                    onChange={(e) => setFestival(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <div className="relative">
                  <textarea
                    className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4 pr-12"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ minHeight: '8rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleDescription}
                    className="absolute right-2 top-2 p-2 bg-transparent hover:bg-gray-100 rounded-full"
                    title="Generate AI Description"
                    disabled={isGeneratingDescription}
                  >
                    {isGeneratingDescription ? (
                      <div className="loader"></div>
                    ) : (
                      "🤖"
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Count In Stock</label>
                  <input
                    type="text"
                    className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                  <select
                    className="w-full bg-[#c3183a16] text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#480815] py-2 px-4"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ProperButtonBlack
                type="submit"
                text={isCreatingProduct ? "Creating..." : "Submit"}
                className="w-full md:w-auto py-3 px-8 mt-6"
                disabled={isCreatingProduct}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;