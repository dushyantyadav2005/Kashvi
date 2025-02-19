import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetAdminOrdersQuery, useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import { useSelector } from "react-redux";
import AdminMenu from "./AdminMenu";
import ProperButtonBlack from "../../components/ProperButtonBlack";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetAdminOrdersQuery();
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f1f3f5] pt-20 px-4 md:px-8 pb-8">
      <div className="max-w-6xl mx-auto">
        <AdminMenu />
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#480815] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left rounded-tl-2xl">ITEMS</th>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">USER</th>
                    <th className="px-4 py-3 text-left">DATE</th>
                    <th className="px-4 py-3 text-left">DELIVERED</th>
                    <th className="px-4 py-3 text-left rounded-tr-2xl">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-[#D4AF37] hover:bg-[#c3183a16]">
                      <td className="px-4 py-3">
                        <img
                          src={order.orderItems[0]?.image}
                          alt={order._id}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">{order._id}</td>
                      <td className="px-4 py-3">
                        {order.user ? order.user.username : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs ${order.isDelivered ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                          {order.isDelivered ? "Completed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ProperButtonBlack
                          as={Link}
                          to={`/order/${order._id}/${userInfo._id}`}
                          className="px-3 py-1 text-sm"
                          text="Details"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;