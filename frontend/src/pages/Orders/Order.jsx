import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error } = useGetOrdersQuery({ id: orderId, user_id: userInfo._id });

  // Ensure orders is an array before accessing it
  const order = Array.isArray(orders) && orders.length > 0 ? orders[0] : null;

  if (!order) return <Message variant="danger">Order not found</Message>;

  return (
    <div className="container mx-auto p-6">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data?.message || "Error loading order"}</Message>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 font-playfair">Order Details</h2>
          <p className="text-gray-600 mb-4">Order ID: {order._id}</p>

          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold mb-3">Ordered Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4">Image</th>
                    <th className="py-2 px-4">Product Name</th>
                    <th className="py-2 px-4">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item.product} className="border-t">
                      <td className="py-2 px-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                      </td>
                      <td className="py-2 px-4">
                        <Link to={`/product/${item.product}`} className="text-blue-500 hover:underline">
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-2 px-4 text-center">{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-semibold mb-3">Shipping Details</h3>
            <p><strong>Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
