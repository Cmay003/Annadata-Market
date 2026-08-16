import { useEffect } from 'react'
import OrderItemCard from './OrderItemCard'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchUserOrderHistory } from '../../../Redux Toolkit/Customer/OrderSlice';
// import { Button } from '@mui/material';

const Order = () => {
  const dispatch = useAppDispatch()
  const { auth, orders } = useAppSelector(store => store);

  useEffect(() => {
    dispatch(fetchUserOrderHistory(localStorage.getItem("jwt") || ""))
  }, [auth.jwt])


  const sortedOrders = [...(orders?.orders || [])].sort(
    (a: any, b: any) =>
      new Date(b.orderDate).getTime() -
      new Date(a.orderDate).getTime()
  );
  return (
    <div className='text-sm min-h-screen'>
      <div className='pb-5'>
        <h1 className='font-semibold'>All orders
        </h1>
        {/* <p>from anytime</p> */}
        <p>
          {sortedOrders.length} orders found
        </p>
      </div>
      <div className='space-y-2'>
        {/* {orders?.orders?.map((order: any) => order?.orderItems.map((item: any) =>
               <OrderItemCard item={item} order={order} />))} */}

        {sortedOrders.map((order: any) =>
          order.orderItems.map((item: any) => (
            <OrderItemCard
              key={item.id}
              item={item}
              order={order}
            />
          ))
        )}
      </div>

    </div>
  )
}

export default Order