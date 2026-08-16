import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Menu, MenuItem, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchSellerOrders, updateOrderStatus } from '../../../Redux Toolkit/Seller/sellerOrderSlice';
import type { Order, OrderItem } from '../../../types/orderTypes';
import { useTranslation } from "react-i18next";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f8faf8",
    color: "#555",
    fontWeight: 600,
    borderBottom: "2px solid #e8f0e8",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



const orderStatus = [
  { color: '#FFA500', key: 'pending' },
  { color: '#F5BCBA', key: 'placed' },
  { color: '#2196F3', key: 'confirmed' },
  { color: '#03A9F4', key: 'packed' },
  { color: '#00BCD4', key: 'ready_for_pickup' },
  { color: '#3F51B5', key: 'in_transit' },
  { color: '#32CD32', key: 'delivered' },
  { color: '#FF0000', key: 'cancelled' },
];


const orderStatusColor: any = {
  PENDING: { color: '#FFA500' },
  PLACED: { color: '#F5BCBA' },
  CONFIRMED: { color: '#2196F3' },
  PACKED: { color: '#03A9F4' },
  READY_FOR_PICKUP: { color: '#00BCD4' },
  IN_TRANSIT: { color: '#3F51B5' },
  DELIVERED: { color: '#32CD32' },
  CANCELLED: { color: '#FF0000' },
};

export default function OrderTable() {

  const { t } = useTranslation();

  const { sellerOrder } = useAppSelector(store => store);
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = React.useState<{ [key: number]: HTMLElement | null }>({});
  const [newOrderAlert, setNewOrderAlert] = React.useState(false);
  const prevOrderCount = React.useRef<number>(0);

  const handleClick = (event: React.MouseEvent<HTMLElement>, orderId: number) => {
    setAnchorEl((prev) => ({ ...prev, [orderId]: event.currentTarget }));
  };

  const handleClose = (orderId: number) => {
    setAnchorEl((prev) => ({ ...prev, [orderId]: null }));
  };

  React.useEffect(() => {
    const jwt = localStorage.getItem("seller_jwt") || "";
    dispatch(fetchSellerOrders(jwt));

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchSellerOrders(jwt));
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Detect new PLACED orders
  React.useEffect(() => {
    const placedCount = sellerOrder.orders.filter((o: Order) => o.orderStatus === 'PLACED').length;
    if (prevOrderCount.current !== 0 && placedCount > prevOrderCount.current) {
      setNewOrderAlert(true);
      setTimeout(() => setNewOrderAlert(false), 8000);
    }
    prevOrderCount.current = placedCount;
  }, [sellerOrder.orders]);

  const handleUpdateOrder = (orderId: number, status: any) => {
    dispatch(updateOrderStatus({
      jwt: localStorage.getItem("seller_jwt") || "",
      orderId,
      orderStatus: status,
    }));
    handleClose(orderId);
  };


  return (
    <>
      <h1 className='pb-5 font-bold text-xl'>
        {t("orders")}
      </h1>

      {/* 🔔 New Order Alert Banner */}
      {newOrderAlert && (
        <div style={{
          background: 'linear-gradient(135deg, #00927c, #0d7a67)',
          color: '#fff', borderRadius: 12, padding: '14px 20px',
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 4px 16px rgba(0,146,124,0.35)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <span style={{ fontSize: 24 }}>🔔</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>New Order Received!</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>A customer has placed a new order. Please confirm and pack it.</div>
          </div>
          <button
            onClick={() => setNewOrderAlert(false)}
            style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18 }}
          >✕</button>
        </div>
      )}

      <TableContainer component={Paper}
        sx={{
          overflowX: "auto"
        }}
      >
        <Table sx={{ minWidth: 700 }}>

          {/* HEADER */}
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: 80 }}>
                {t("orderId")}
              </StyledTableCell>

              <StyledTableCell sx={{ minWidth: 280 }}>
                {t("products")}
              </StyledTableCell>

              <StyledTableCell sx={{ width: 120 }}>
                Product Amount
              </StyledTableCell>

              <StyledTableCell sx={{ width: 100 }}>
                Quantity
              </StyledTableCell>

              <StyledTableCell sx={{ width: 120 }}>
                Commission
              </StyledTableCell>

              <StyledTableCell sx={{ width: 140 }}>
                Farmer Earnings
              </StyledTableCell>

              <StyledTableCell sx={{ minWidth: 250 }}>
                {t("address")}
              </StyledTableCell>

              <StyledTableCell sx={{ width: 120 }}>
                {t("orderStatus")}
              </StyledTableCell>

              <StyledTableCell sx={{ width: 120 }}>
                {t("update")}
              </StyledTableCell>

            </TableRow>
          </TableHead>

          {/* BODY */}
          <TableBody>
            {/* {sellerOrder.orders.map((item: Order) => ( */}
            {[...sellerOrder.orders]
              .sort(
                (a, b) =>
                  new Date(b.orderDate).getTime() -
                  new Date(a.orderDate).getTime()
              )
              .map((item: Order) => (
                <StyledTableRow key={item.id}>

                  <StyledTableCell>{item.id}</StyledTableCell>

                  <StyledTableCell>
                    <div className='flex gap-1 flex-wrap'>
                      {item.orderItems.map((orderItem: OrderItem) => (
                        <div key={orderItem.id} className='flex gap-5'>
                          <img className='w-20 rounded-md' src={orderItem.product.images[0]} />
                          <div className='flex flex-col justify-between py-2'>
                            <h1>{orderItem.product.title}</h1>

                          </div>
                        </div>
                      ))}
                    </div>
                  </StyledTableCell>

                  <StyledTableCell>
                    {/* ₹{item.totalSellingPrice || 0} */}
                    <div className='flex gap-2 flex-wrap'>
                      {item.orderItems.map((orderItem: OrderItem) => (
                        <div key={orderItem.id} className='flex gap-5'>
                          <div className='flex flex-col justify-between py-2'>
                            ₹{orderItem.sellingPrice}
                          </div>
                        </div>
                      ))}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    {/* ₹{item.totalSellingPrice || 0} */}
                    <div className='flex gap-1 flex-wrap'>
                      {item.orderItems.map((orderItem: OrderItem) => (
                        <div key={orderItem.id} className='flex gap-5'>
                          <div className='flex flex-col justify-between py-2'>
                            ₹{orderItem.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </StyledTableCell>

                  <StyledTableCell>

                    ₹{item.commissionAmount || 0}

                    {item.commissionPercent && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#777"
                        }}
                      >
                        ({item.commissionPercent}%)
                      </div>
                    )}

                  </StyledTableCell>

                  <StyledTableCell>

                    <span
                      style={{
                        color: "#2e7d32",
                        fontWeight: 600
                      }}
                    >
                      ₹{item.farmerAmount || 0}
                    </span>

                  </StyledTableCell>




                  <StyledTableCell>
                    <div className='flex flex-col gap-y-2'>
                      <h1>{item.shippingAddress.name}</h1>
                      <h1>
                        {item.shippingAddress.address}, {item.shippingAddress.city}
                      </h1>
                      <h1>
                        {item.shippingAddress.state} - {item.shippingAddress.pinCode}
                      </h1>
                      <h1>
                        <strong>{t("mobile")}:</strong> {item.shippingAddress.mobile}
                      </h1>
                    </div>
                  </StyledTableCell>

                  {/* STATUS */}
                  <StyledTableCell
                    sx={{ color: orderStatusColor[item.orderStatus]?.color }}
                    align="center"
                  >
                    <Box
                      sx={{ borderColor: orderStatusColor[item.orderStatus]?.color }}
                      className="border px-2 py-1 rounded-full text-xs"
                    >
                      {t(item.orderStatus.toLowerCase())}
                    </Box>
                  </StyledTableCell>

                  {/* UPDATE */}
                  {/* <StyledTableCell align="right">
                    <Button
                      size='small'
                      onClick={(e) => handleClick(e, item.id)}
                    >
                      {t("update")}
                    </Button>

                    <Menu
                      anchorEl={anchorEl[item.id]}
                      open={Boolean(anchorEl[item.id])}
                      onClose={() => handleClose(item.id)}
                    >
                      {orderStatus.map((status) => (
                        <MenuItem
                          key={status.key}
                          onClick={() => handleUpdateOrder(item.id, status.key.toUpperCase())}
                        >
                          {t(status.key)}
                        </MenuItem>
                      ))}
                    </Menu>

                  </StyledTableCell> */}

                  <StyledTableCell align="right">

                    {item.orderStatus === "DELIVERED" ||
                      item.orderStatus === "CANCELLED" ||
                      item.orderStatus === "IN_TRANSIT" ||
                      item.orderStatus === "READY_FOR_PICKUP" ? (

                      <Button
                        size="small"
                        disabled
                        color="inherit"
                        sx={{ fontWeight: 600 }}
                      >
                        {item.orderStatus === "READY_FOR_PICKUP" ? "🚚 Awaiting Pickup" :
                         item.orderStatus === "IN_TRANSIT" ? "🛵 In Transit" :
                         item.orderStatus === "DELIVERED" ? "✅ Delivered" : "Cancelled"}
                      </Button>

                    ) : (

                      <>
                        <Button
                          size="small"
                          onClick={(e) => handleClick(e, item.id)}
                        >
                          {t("update")}
                        </Button>

                        <Menu
                          anchorEl={anchorEl[item.id]}
                          open={Boolean(anchorEl[item.id])}
                          onClose={() => handleClose(item.id)}
                        >
                          {item.orderStatus === "PLACED" && (
                            <MenuItem
                              onClick={() =>
                                handleUpdateOrder(item.id, "CONFIRMED")
                              }
                            >
                              Confirm Order
                            </MenuItem>
                          )}

                          {item.orderStatus === "CONFIRMED" && (
                            <MenuItem
                              onClick={() =>
                                handleUpdateOrder(item.id, "PACKED")
                              }
                            >
                              Mark Packed
                            </MenuItem>
                          )}

                          {item.orderStatus === "PACKED" && (
                            <MenuItem
                              onClick={() =>
                                handleUpdateOrder(item.id, "READY_FOR_PICKUP")
                              }
                            >
                              Ready For Pickup
                            </MenuItem>
                          )}

                          <MenuItem
                            onClick={() =>
                              handleUpdateOrder(
                                item.id,
                                "CANCELLED"
                              )
                            }
                            sx={{ color: "red" }}
                          >
                            Cancel Order
                          </MenuItem>

                        </Menu>
                      </>
                    )}

                  </StyledTableCell>



                </StyledTableRow>
              ))}
          </TableBody>

        </Table>
      </TableContainer>
    </>
  );
}