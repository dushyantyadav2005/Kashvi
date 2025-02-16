import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import ProperButton from "../../components/ProperButton";
import ProperButtonBlack from "../../components/ProperButtonBlack";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [designNumber, setDesignNumber] = useState(""); // Added designNumber state
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [festival, setFestival] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("designNumber", designNumber); // Added designNumber to form data
      if (category) {
        productData.append("category", category);
      } else {
        productData.append("category", categories[0]._id);
      }
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
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const handleDescription = async () => {
    try {
      // Create tags array from the tags input, name and festival
      const tagsList = [...tags.split(',').map(tag => tag.trim()), name, festival].filter(tag => tag !== '');

      const response = await fetch('http://localhost:8002/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: tagsList,
          use_gemini: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate description');
      }

      const data = await response.json();
      setDescription(data.description);
      toast.success('Description generated successfully');
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Failed to generate description: ' + error.message);
    }
  };

  const handleTagGeneration = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8001/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate tags');
      }

      const data = await response.json();
      // Update the tags input with the generated tags
      setTags(data.tags.join(', '));
      toast.success('Tags generated successfully');
    } catch (error) {
      console.error('Error generating tags:', error);
      toast.error('Failed to generate tags');
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("image", file);

    try {
      // Upload image for product
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);

      // Generate tags from the same image
      await handleTagGeneration(file);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">

          <h2 className="h4 text-center font-playfair capitalize m-10 mb-0 text-4xl font-medium">CREATE</h2>
          <h2 className="h4 text-center font-montserrat uppercase tracking-wider m-10 mt-0 text-lg ">Product</h2>

          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="border px-4 block w-full text-center cursor-pointer font-bold py-11">
                {image ? image.name : "Upload Image"}

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className={!image ? "hidden" : "text-white"}
                />
              </label>
            </div>

            <div className="p-3">
              <div className="flex flex-wrap">
                <div className="two">
                  <label htmlFor="name">Name</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="two ml-10">
                  <label htmlFor="designNumber">Design Number</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border"
                    value={designNumber}
                    onChange={(e) => setDesignNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name block">Quantity</label> <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[30rem] border"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="two ml-10 ">
                  <label htmlFor="name block">Festival</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border-2"
                    value={festival}
                    onChange={(e) => setFestival(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="tags">Tags (comma-separated)</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[95%] border"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <label htmlFor="" className="my-5">
                Description
              </label>
              <div className="relative">
                <textarea
                  type="text"
                  className="p-2 mb-3 border w-[95%] pr-12 h-50 scrollbar-hide"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'vertical', minHeight: '8rem', maxHeight: '20rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                ></textarea>
                <button
                  onClick={handleDescription}
                  className="absolute right-14 top-2 p-2 text-white hover:bg-pink-700 transition-colors"
                  title="Generate AI Description"
                >
                  🤖
                </button>
              </div>

              <div className="flex justify-between">
                <div>
                  <label htmlFor="name block">Count In Stock</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="">Category</label> <br />
                  <select
                    placeholder="Choose Category"
                    className="p-4 mb-3 w-[30rem] border"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ProperButtonBlack text={'Submit'} className={'py-4 px-10 mt-5 text-lg '} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;