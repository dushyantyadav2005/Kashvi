import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import ProperButtonBlack from "../../components/ProperButtonBlack";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted successfully.");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully.");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f1f3f5] pt-20 px-4 md:px-8 pb-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-playfair text-3xl md:text-4xl text-center mb-8 uppercase">User Management</h1>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-4 md:p-8 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm md:text-base">
              <thead className="bg-[#480815] text-white">
                <tr>
                  <th className="px-4 py-3 text-left rounded-tl-2xl">ID</th>
                  <th className="px-4 py-3 text-left">NAME</th>
                  <th className="px-4 py-3 text-left">EMAIL</th>
                  <th className="px-4 py-3 text-left">ADMIN</th>
                  <th className="px-4 py-3 text-left rounded-tr-2xl">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-[#D4AF37] hover:bg-[#c3183a16]">
                    <td className="px-4 py-3 text-xs md:text-sm">{user._id}</td>
                    <td className="px-4 py-3">
                      {editableUserId === user._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="bg-[#c3183a16] border border-[#480815] focus:ring-2 focus:ring-[#D4AF37] rounded-md p-2 w-full"
                          />
                          <ProperButtonBlack
                            onClick={() => updateHandler(user._id)}
                            className="p-2"
                            text={<FaCheck />}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {user.username}
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="text-[#480815] hover:text-[#D4AF37] transition-colors"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editableUserId === user._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="bg-[#c3183a16] border border-[#480815] focus:ring-2 focus:ring-[#D4AF37] rounded-md p-2 w-full"
                          />
                          <ProperButtonBlack
                            onClick={() => updateHandler(user._id)}
                            className="p-2"
                            text={<FaCheck />}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <a href={`mailto:${user.email}`} className="text-[#480815] hover:text-[#D4AF37]">
                            {user.email}
                          </a>
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="text-[#480815] hover:text-[#D4AF37] transition-colors"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.isAdmin ? (
                        <FaCheck className="text-green-600" />
                      ) : (
                        <FaTimes className="text-red-600" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!user.isAdmin && (
                        <ProperButtonBlack
                          onClick={() => deleteHandler(user._id)}
                          className="bg-[#d11a3eeb] hover:bg-[#c3183a] p-2"
                          text={<FaTrash />}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
