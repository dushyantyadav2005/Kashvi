import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import ProperButtonBlack from "../../components/ProperButtonBlack";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category delection failed. Tray again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f1f3f5] pt-20 px-4 md:px-8 pb-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <AdminMenu />
        
        <div className="flex-1">
          

          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6">
            <CategoryForm
              value={name}
              setValue={setName}
              handleSubmit={handleCreateCategory}
            />

            <div className="mt-8 border-t border-[#D4AF37] pt-6">
              <div className="flex flex-wrap gap-3">
                {categories?.map((category) => (
                  <ProperButtonBlack
                    key={category._id}
                    className="bg-[#c3183a16] text-[#480815] hover:bg-[#480815] hover:text-white"
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedCategory(category);
                      setUpdatingName(category.name);
                    }}
                    text={category.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <div className="bg-white rounded-2xl p-6">
              <CategoryForm
                value={updatingName}
                setValue={(value) => setUpdatingName(value)}
                handleSubmit={handleUpdateCategory}
                buttonText="Update"
                handleDelete={handleDeleteCategory}
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;