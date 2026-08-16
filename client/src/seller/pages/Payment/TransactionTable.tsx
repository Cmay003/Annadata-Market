import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchTransactionsBySeller } from '../../../Redux Toolkit/Seller/transactionSlice';
import type { Transaction } from '../../../types/Transaction';
import { redableDateTime } from '../../../util/redableDateTime';
import { useTranslation } from 'react-i18next';

// const orderStatusColor = {
//   PENDING: { color: '#FFA500', label: 'PENDING' }, // Orange
//   SHIPPED: { color: '#1E90FF', label: 'SHIPPED' }, // DodgerBlue
//   DELIVERED: { color: '#32CD32', label: 'DELIVERED' }, // LimeGreen
//   CANCELLED: { color: '#FF0000', label: 'CANCELLED' } // Red
// };

import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(() => ({
  backgroundColor: "#f8faf8",
  color: "#555",
  fontWeight: 600,
  borderBottom: "2px solid #e8f0e8",
}));

export default function TransactionTable() {

  const { t } = useTranslation();
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const { sellerOrder, transaction } = useAppSelector(store => store);
  const transaction = useAppSelector(store => store.transaction);
  // const transaction =useAppSelector(state=>state.transaction);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchTransactionsBySeller(localStorage.getItem("seller_jwt") || ""));
  }, [dispatch]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>{t("date")}</StyledTableCell>
              <StyledTableCell>{t("customer_details")}</StyledTableCell>
              <StyledTableCell>{t("order")}</StyledTableCell>
              <StyledTableCell align="right">{t("amount")}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transaction.transactions.map((item: Transaction) => (
              <TableRow key={item.id}>
                <TableCell align="left"><div className='space-y-1'>
                  <h1 className='font-medium'>{redableDateTime(item.date).split("at")[0]}</h1>
                  <h1 className='text-xs text-gray-600 font-semibold'>{redableDateTime(item.date).split("at")[1]}</h1>
                  </div></TableCell>
                <TableCell component="th" scope="row">
                  <div className='space-y-2'>
                    <h1>{item.customer.fullName}</h1>
                    <h1 className='font-semibold'>{item.customer.email}</h1>
                    <h1 className='font-bold text-gray-600'>{item.customer.mobile}</h1>
                  </div>
                </TableCell>
                <TableCell>
                  {t("order_id")}: <strong> {item.order.id} </strong> 
                </TableCell>
                <TableCell
                  align="right">
                  ₹{item.order.totalSellingPrice}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
