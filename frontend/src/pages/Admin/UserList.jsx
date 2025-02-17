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

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
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
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f1f3f5] pt-20 px-4 md:px-8 pb-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-playfair text-4xl text-center mb-8 uppercase">User Management</h1>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 md:p-8">
            <table className="w-full">
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
                    <td className="px-4 py-3 text-sm">{user._id}</td>
                    <td className="px-4 py-3">
                      {editableUserId === user._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="bg-[#c3183a16] border border-[#480815] focus:ring-2 focus:ring-[#D4AF37] rounded-sm p-2 w-full"
                          />
                          <ProperButtonBlack
                            onClick={() => updateHandler(user._id)}
                            className="px-3 py-2"
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
                            className="bg-[#c3183a16] border border-[#480815] focus:ring-2 focus:ring-[#D4AF37] rounded-sm p-2 w-full"
                          />
                          <ProperButtonBlack
                            onClick={() => updateHandler(user._id)}
                            className="px-3 py-2"
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
                    <td className="px-4 py-3">
                      {user.isAdmin ? (
                        <FaCheck className="text-green-600" />
                      ) : (
                        <FaTimes className="text-red-600" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {!user.isAdmin && (
                        <ProperButtonBlack
                          onClick={() => deleteHandler(user._id)}
                          className="bg-[#d11a3eeb] hover:bg-[#c3183a] px-3 py-2"
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