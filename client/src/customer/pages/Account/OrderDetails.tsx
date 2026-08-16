import { Box, Button, Divider } from '@mui/material'
import { useEffect } from 'react'
import PaymentsIcon from '@mui/icons-material/Payments';
import OrderStepper from './OrderStepper';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { cancelOrder, fetchOrderById, fetchOrderItemById } from '../../../Redux Toolkit/Customer/OrderSlice';
import { useNavigate, useParams } from 'react-router-dom';

const OrderDetails = () => {
  const dispatch = useAppDispatch()
  const { auth, orders } = useAppSelector(store => store);
  // const { cart, auth, orders } = useAppSelector(store => store);
  const { orderItemId, orderId } = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchOrderItemById({
      orderItemId: Number(orderItemId),
      jwt: localStorage.getItem("jwt") || ""
    }))
    dispatch(fetchOrderById({
      orderId: Number(orderId),
      jwt: localStorage.getItem("jwt") || ""
    }))
  }, [auth.jwt])

  if (!orders.orders || !orders.orderItem) {
    return <div className='h-[80vh] flex justify-center items-center'>
      No order found
    </div>;
  }

  const handleCancelOrder = () => {
    dispatch(cancelOrder(orderId))
  }

  return (
    <Box className='space-y-5 '>

      <section className='flex flex-col gap-5 justify-center items-center'>
        <img className='w-[100px]' src={orders.orderItem?.product.images[0]} alt="" />
        <div className='text-sm space-y-1 text-center'>
          <h1 className='font-bold'>{orders.orderItem?.product.seller?.businessDetails.businessName}
          </h1>
          <p>{orders.orderItem?.product.title}</p>
          <p>
            <strong>Quantity:</strong>{" "}
            {orders.orderItem?.quantity}
          </p>

          <p>
            <strong>Product Price:</strong> ₹
            {orders.orderItem?.sellingPrice}
          </p>
          <p>
            <strong>Delivery Charge:</strong> ₹
            {/* {orders.orderItem?.deliveryCharge} */}
            25
          </p>
        </div>
        <div>
          <Button onClick={() => navigate(`/reviews/${orders.orderItem?.product.id}/create`)}>Write Review</Button>
        </div>
      </section>

      <section className='border p-5'>
        <OrderStepper
          orderStatus={orders.currentOrder?.orderStatus || "PLACED"}
        />
      </section>

      {/* ─── OTP Section: shown when order is out for delivery ─── */}
      {orders.currentOrder?.orderStatus === "IN_TRANSIT" && (
        <div style={{
          margin: '0 0 8px 0',
          border: '2px solid #a7f3d0',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #f0fdf9, #d1fae5)',
          padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>🚴</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#065f46' }}>
                Your Order is Out for Delivery!
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#047857' }}>
                Share the OTP below with the delivery person to receive your order
              </p>
            </div>
          </div>

          {orders.currentOrder?.deliveryOtp ? (
            <div style={{
              background: '#fff',
              border: '2px dashed #00927c',
              borderRadius: 12,
              padding: '16px 20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                Delivery OTP
              </div>
              <div style={{
                fontSize: 40, fontWeight: 900, letterSpacing: 12,
                color: '#00927c', fontFamily: 'monospace',
              }}>
                {orders.currentOrder.deliveryOtp}
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
                ⚠️ Share ONLY with your delivery partner
              </div>
            </div>
          ) : (
            <div style={{ color: '#047857', fontSize: 13, fontStyle: 'italic' }}>
              OTP will appear here once the delivery person picks up your order.
              You will also receive it via email.
            </div>
          )}
        </div>
      )}

      <div className='border p-5'>
        <h1 className='font-bold pb-3'>Delivery Address</h1>
        <div className='text-sm space-y-2'>
          <div className='flex gap-5 font-medium'>
            <p> {orders.currentOrder?.shippingAddress.name}</p>
            <Divider flexItem orientation='vertical' />
            <p>{orders.currentOrder?.shippingAddress.mobile}</p>
          </div>

          <p>
            {orders.currentOrder?.shippingAddress.address}, {orders.currentOrder?.shippingAddress.city}, {orders.currentOrder?.shippingAddress.state} - {orders.currentOrder?.shippingAddress.pinCode}
          </p>
        </div>
      </div>

      <div className='border  space-y-4'>

        <div className='flex justify-between text-sm pt-5 px-5'>
          <div className='space-y-1'>
            <p className='font-bold'>Total Item Price</p>
            <p>You saved <span className='text-green-500 font-medium text-xs'>₹
              {
                (
                  (orders.orderItem?.mrpPrice || 0) -
                  (orders.orderItem?.sellingPrice || 0)
                ) 
              }.00</span> on this item</p>
          </div>

          {/* <p className='font-medium'>₹ {orders.orderItem?.sellingPrice}.00</p> */}
          <p className='font-medium'>
            ₹{
              (orders.orderItem?.sellingPrice || 0)+25
            }
          </p>
        </div>

        <div className='px-5 '>
          <div className='bg-teal-50 px-5 py-2 text-xs font-medium flex items-center gap-3 '>
            <PaymentsIcon />
            <p >Pay On Delivery</p>


          </div>
        </div>


        <Divider />
        <div className='px-5 pb-5'>
          <p className='text-xs'><strong>Sold by : </strong>{orders.orderItem.product.seller?.businessDetails.businessName}</p>
        </div>

        <div className='p-10'>
          <Button
            // disabled={orders.currentOrder?.orderStatus === "CANCELLED"}
            disabled={
              orders.currentOrder?.orderStatus === "CANCELLED" ||
              orders.currentOrder?.orderStatus === "DELIVERED"
            }
            onClick={handleCancelOrder}
            color='error' sx={{ py: "0.7rem" }} className='' variant='outlined' fullWidth>
            {/* {orders.currentOrder?.orderStatus === "CANCELLED" ? "order canceled" : "Cancel Order"} */}
            {
              orders.currentOrder?.orderStatus === "DELIVERED"
                ? "Delivered"

                : orders.currentOrder?.orderStatus === "CANCELLED"
                  ? "Order Cancelled"

                  : "Cancel Order"
            }
          </Button>
        </div>
      </div>
    </Box>
  )
}

export default OrderDetails