
// import { Backdrop, Button, CircularProgress } from "@mui/material";
// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import { paymentSuccess } from "../../../Redux Toolkit/Customer/OrderSlice";
// import { fetchUserCart, resetCartState } from "../../../Redux Toolkit/Customer/CartSlice";
// import { useLocation, useNavigate, useParams } from "react-router-dom";

// const PaymentSuccessHandler = () => {
//   const dispatch = useAppDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { orderId } = useParams(); // ✅ get orderId from URL

//   const { orders, loading } = useAppSelector((store) => store.orders);

//   const getQueryParam = (key: string): string | null => {
//     const params = new URLSearchParams(location.search);
//     return params.get(key);
//   };

//   const paymentId = getQueryParam("razorpay_payment_id");
//   const paymentLinkId = getQueryParam("razorpay_payment_link_id");

//   useEffect(() => {
//     const handlePayment = async () => {
//       try {
//         // ✅ If Razorpay
//         if (paymentId) {
//           await dispatch(
//             paymentSuccess({
//               paymentId,
//               paymentLinkId: paymentLinkId || "",
//               jwt: localStorage.getItem("jwt") || "",
//             })
//           );
//         }

//         // ✅ COD case (no paymentId)
//         if (!paymentId && orderId) {
//           console.log("COD Order Success:", orderId);
//         }

//         // ✅ Clear cart
//         dispatch(resetCartState());
//         dispatch(fetchUserCart(localStorage.getItem("jwt") || ""));
//       } catch (error) {
//         console.error("Payment error:", error);
//       }
//     };

//     handlePayment();
//   }, [paymentId, orderId]);

//   // 🧠 Get latest order
//   const latestOrder = orders?.[0];

//   return (
//     <div className="min-h-[90vh] flex justify-center items-center bg-gray-100 p-4">
//       {loading ? (
//         <Backdrop open={true}>
//           <CircularProgress color="inherit" />
//         </Backdrop>
//       ) : (
//         <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center flex flex-col gap-5">
          
//           {/* ✅ Success Icon */}
//           <div className="text-5xl">✅</div>

//           {/* ✅ Title */}
//           <h1 className="text-2xl font-bold text-green-600">
//             Order Placed Successfully!
//           </h1>

//           {/* ✅ Order Info */}
//           <div className="text-gray-700 text-sm">
//             <p><strong>Order ID:</strong> {orderId || latestOrder?.id}</p>
//             <p><strong>Payment:</strong> {paymentId ? "Paid Online" : "Cash on Delivery"}</p>
//             <p><strong>Status:</strong> Confirmed</p>
//           </div>

//           {/* ✅ Delivery Estimate */}
//           <div className="bg-green-50 p-3 rounded-md text-green-700 text-sm">
//             Estimated Delivery: <strong>3 - 5 Days</strong>
//           </div>

//           {/* ✅ Buttons */}
//           <div className="flex flex-col gap-3 mt-4">
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => navigate(`/account/orders/${orderId}/${latestOrder?.orderItems[0]?.id}`)}
//             >
//               📦 Track Order
//             </Button>

//             <Button
//               variant="outlined"
//               onClick={() => navigate("/account/orders")}
//             >
//               View My Orders
//             </Button>

//             <Button
//               variant="text"
//               onClick={() => navigate("/")}
//             >
//               Continue Shopping
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentSuccessHandler;

import {
  Backdrop,
  Button,
  CircularProgress,
} from "@mui/material";

import { useEffect, useRef } from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../Redux Toolkit/Store";

import {
  paymentSuccess,
} from "../../../Redux Toolkit/Customer/OrderSlice";

import {
  fetchUserCart,
  resetCartState,
} from "../../../Redux Toolkit/Customer/CartSlice";

const PaymentSuccessHandler = () => {

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const { orderId } = useParams();

  const hasExecuted = useRef(false);

  const { orders, loading } =
    useAppSelector((store) => store.orders);

  const getQueryParam = (key: string): string | null => {
    const params = new URLSearchParams(location.search);
    return params.get(key);
  };

  const paymentId =
    getQueryParam("razorpay_payment_id");

  const paymentLinkId =
    getQueryParam("razorpay_payment_link_id");

  useEffect(() => {

    // ✅ Prevent duplicate execution
    if (hasExecuted.current) return;

    hasExecuted.current = true;

    const handlePayment = async () => {

      try {

        // ✅ ONLINE PAYMENT
        if (paymentId) {

          await dispatch(
            paymentSuccess({
              paymentId,
              paymentLinkId: paymentLinkId || "",
              jwt: localStorage.getItem("jwt") || "",
            })
          );
        }

        // ✅ CLEAR CART
        dispatch(resetCartState());

        await dispatch(
          fetchUserCart(
            localStorage.getItem("jwt") || ""
          )
        );

      } catch (error) {

        console.error(
          "Payment verification failed",
          error
        );
      }
    };

    handlePayment();

  }, []);

  const latestOrder = orders?.[0];

  const firstOrderItemId =
    latestOrder?.orderItems &&
    latestOrder.orderItems.length > 0
      ? latestOrder.orderItems[0].id
      : null;

  return (
    <div className="min-h-[90vh] flex justify-center items-center bg-gray-100 p-4">

      {loading ? (

        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>

      ) : (

        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center flex flex-col gap-5">

          {/* SUCCESS ICON */}
          <div className="text-5xl">
            ✅
          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-bold text-green-600">
            Order Placed Successfully!
          </h1>

          {/* ORDER INFO */}
          <div className="text-gray-700 text-sm space-y-2">

            <p>
              <strong>Order ID:</strong>{" "}
              {orderId || latestOrder?.id}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {paymentId
                ? "Paid Online"
                : "Cash On Delivery"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              Confirmed
            </p>

          </div>

          {/* DELIVERY BOX */}
          <div className="bg-green-50 p-3 rounded-md text-green-700 text-sm">

            Estimated Delivery:
            <strong> 3 - 5 Days</strong>

          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 mt-4">

            {firstOrderItemId && (

              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  navigate(
                    `/account/orders/${orderId}/${firstOrderItemId}`
                  )
                }
              >
                📦 Track Order
              </Button>

            )}

            <Button
              variant="outlined"
              onClick={() =>
                navigate("/account/orders")
              }
            >
              View My Orders
            </Button>

            <Button
              variant="text"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </Button>

          </div>

        </div>

      )}
    </div>
  );
};

export default PaymentSuccessHandler;