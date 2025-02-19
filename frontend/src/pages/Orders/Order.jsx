import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import ProperButtonBlack from "../../components/ProperButtonBlack";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {const { id: orderId } = useParams();

const {
  data: order,
  refetch,
  isLoading,
  error,
} = useGetOrderDetailsQuery(orderId);

const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
const [deliverOrder, { isLoading: loadingDeliver }] =
  useDeliverOrderMutation();
const { userInfo } = useSelector((state) => state.auth);

const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

const {
  data: paypal,
  isLoading: loadingPaPal,
  error: errorPayPal,
} = useGetPaypalClientIdQuery();

useEffect(() => {
  if (!errorPayPal && !loadingPaPal && paypal.clientId) {
    const loadingPaPalScript = async () => {
      paypalDispatch({
        type: "resetOptions",
        value: {
          "client-id": paypal.clientId,
          currency: "USD",
        },
      });
      paypalDispatch({ type: "setLoadingStatus", value: "pending" });
    };

    if (order && !order.isPaid) {
      if (!window.paypal) {
        loadingPaPalScript();
      }
    }
  }
}, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

function onApprove(data, actions) {
  return actions.order.capture().then(async function (details) {
    try {
      await payOrder({ orderId, details });
      refetch();
      toast.success("Order is paid");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  });
}

function createOrder(data, actions) {
  return actions.order
    .create({
      purchase_units: [{ amount: { value: order.totalPrice } }],
    })
    .then((orderID) => {
      return orderID;
    });
}

function onError(err) {
  toast.error(err.message);
}

const deliverHandler = async () => {
  await deliverOrder(orderId);
  refetch();
};

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f1f3f5] pt-20 px-4 md:px-8 pb-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="font-playfair text-2xl mb-4 uppercase">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#480815] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left rounded-tl-2xl">Image</th>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={index} className="border-b border-[#D4AF37] hover:bg-[#c3183a16]">
                        <td className="px-4 py-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link 
                            to={`/product/${item.product}`}
                            className="text-[#480815] hover:text-[#D4AF37] transition-colors"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">{item.qty}</td>
                        <td className="px-4 py-3">${item.price}</td>
                        <td className="px-4 py-3 font-medium">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="font-playfair text-2xl mb-4 uppercase">Shipping Details</h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-[#480815]">Order ID:</strong> {order._id}
              </p>
              <p>
                <strong className="text-[#480815]">Name:</strong> {order.user.username}
              </p>
              <p>
                <strong className="text-[#480815]">Email:</strong> {order.user.email}
              </p>
              <p>
                <strong className="text-[#480815]">Address:</strong>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              <p>
                <strong className="text-[#480815]">Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success" className="mt-4">
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </Message>
              ) : (
                <Message variant="danger" className="mt-4">
                  Payment Pending
                </Message>
              )}
            </div>
          </div>

          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6">
            <h2 className="font-playfair text-2xl mb-4 uppercase">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${order.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-[#D4AF37] pt-3">
                <span>Total:</span>
                <span>${order.totalPrice}</span>
              </div>
            </div>

            {!order.isPaid && (
              <div className="mt-6">
                {loadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <div className="paypal-button-container">
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  </div>
                )}
              </div>
            )}

            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <ProperButtonBlack
                onClick={deliverHandler}
                className="w-full mt-6 bg-[#d11a3eeb] hover:bg-[#c3183a]"
                text="Mark As Delivered"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;