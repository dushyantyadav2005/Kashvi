import ProperButtonBlack from "../components/ProperButtonBlack";

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-6">
      <div className="text-center mb-10">
        <h2 className="h4 text-center font-playfair m-10 mb-0 text-4xl uppercase">
          MANAGE
        </h2>
        <h2 className="h4 text-center font-montserrat m-10 mt-0 mb-10 text-sm uppercase">
          CATEGORIES
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          className="bg-[#c3183a16] border border-[#480815] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none py-3 px-4 rounded-sm w-full"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex gap-4">
          <ProperButtonBlack
            type="submit"
            className="w-full"
            text={buttonText}
          />

          {handleDelete && (
            <ProperButtonBlack
              onClick={handleDelete}
              className="w-full"
              text="Delete"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;