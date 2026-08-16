

import * as React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  IconButton, styled, Chip, CircularProgress
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchSellerProducts,
  updateProductStock,
} from "../../../Redux Toolkit/Seller/sellerProductSlice";
import type { Product } from "../../../types/productTypes";
import { useTranslation } from "react-i18next";

// ✅ Styled
const StyledTableCell = styled(TableCell)(() => ({
  backgroundColor: "#f8faf8",
  color: "#555",
  fontWeight: 600,
  borderBottom: "2px solid #e8f0e8",
}));

// // ✅ Type
// interface Product {
//   id: number;
//   title: string;
//   mrpPrice: number;
//   sellingPrice: number;
//   discountPercent?: number;
//   images: string[];
//   in_stock?: boolean;
//   weight?: number;
//   unit?: string;
//   grade?: "A" | "B" | "C";
// }

export default function ProductTable() {
  const { products, loading } = useAppSelector(
    (store) => store.sellerProduct
  );

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    const jwt = localStorage.getItem("seller_jwt");
    if (jwt) {
      dispatch(fetchSellerProducts({ jwt }));
    }
  }, [dispatch]);

  // const handleUpdateStock = (id: any) => {
  //   dispatch(updateProductStock(id));
  // };


  const handleUpdateStock = (product: Product) => {
  const jwt = localStorage.getItem("seller_jwt");

  if (!jwt) return;

  dispatch(
    updateProductStock({
      productId: product.id,
      quantity: product.quantity ?? 0,
      jwt,
    })
  );
};
  // ✅ Grade Color
  const getGradeColor = (grade?: string) => {
    if (grade === "A") return "success";
    if (grade === "B") return "warning";
    return "default";
  };

  return (
    <>
      {/* <h1 className="pb-5 font-bold text-xl">Products</h1> */}
      <h1 className="pb-5 font-bold text-xl">{t("products")}</h1>

      <TableContainer component={Paper}>
        <Table>

          {/* HEADER */}
          {/* <TableHead>
            <TableRow>
              <StyledTableCell>Images</StyledTableCell>
              <StyledTableCell align="right">Title</StyledTableCell>
              <StyledTableCell align="right">Grade</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Weight</StyledTableCell>
              <StyledTableCell align="right">Stock</StyledTableCell>
              <StyledTableCell align="right">Update</StyledTableCell>
            </TableRow>
          </TableHead> */}

          <TableHead>
            <TableRow>
              <StyledTableCell>{t("images")}</StyledTableCell>
              <StyledTableCell align="right">{t("title")}</StyledTableCell>
              <StyledTableCell align="right">{t("grade")}</StyledTableCell>
              <StyledTableCell align="right">{t("price")}</StyledTableCell>

              <StyledTableCell align="right">
                Commission %
              </StyledTableCell>

              <StyledTableCell align="right">
                Farmer Earn
              </StyledTableCell>
              <StyledTableCell align="right">{t("weight")}</StyledTableCell>
              <StyledTableCell align="right">{t("stock")}</StyledTableCell>
              <StyledTableCell align="right">{t("update")}</StyledTableCell>
            </TableRow>
          </TableHead>



          {/* BODY */}
          <TableBody>

            {loading && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}

            {!loading && products.length === 0 && (
              <TableRow>
                {/* <TableCell colSpan={7} align="center">
                  No Products Found
                </TableCell> */}

                <TableCell colSpan={7} align="center">
                  {t("no_products")}
                </TableCell>
              </TableRow>
            )}

            {products.map((item: Product) => (
              <TableRow key={item.id}>

                {/* IMAGES */}
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {item.images?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="w-14 h-14 object-cover rounded"
                        alt="product"
                      />
                    ))}
                  </div>
                </TableCell>

                {/* TITLE */}
                <TableCell align="right">{item.title}</TableCell>

                {/* ✅ GRADE */}
                <TableCell align="right">
                  {/* <Chip
                    label={`Grade ${item.grade || "B"}`}
                    color={getGradeColor(item.grade)}
                  /> */}

                  <Chip
                    label={`${t("grade")} ${item.grade || "B"}`}
                    color={getGradeColor(item.grade)}
                  />
                </TableCell>

                {/* ✅ PRICE (IMPROVED) */}
                <TableCell align="right">
                  <div className="flex flex-col items-end">
                    <span className="font-semibold">
                      ₹{item.sellingPrice}
                    </span>

                    <span className="line-through text-gray-400 text-sm">
                      ₹{item.mrpPrice}
                    </span>

                    {item.discountPercent && (
                      <span className="text-green-600 text-xs">
                        {item.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell align="right">
                  {item.commissionPercentage ?? 0}%
                </TableCell>

                <TableCell align="right">
                  ₹{item.farmerEarning?.toFixed(2) ?? 0}
                </TableCell>

                {/* WEIGHT */}
                <TableCell align="right">
                  {item.weight} {item.unit}
                </TableCell>

                {/* STOCK */}
                <TableCell align="right">
                  {/* <Chip
                    label={item.in_stock ? "In Stock" : "Out of Stock"}
                    color={item.in_stock ? "success" : "error"}
                    onClick={() => handleUpdateStock(item.id)}
                  /> */}

                  <Chip
                    label={item.in_stock ? t("in_stock") : t("out_stock")}
                    color={item.in_stock ? "success" : "error"}
                    // onClick={() => handleUpdateStock(item.id)
                    onClick={() => handleUpdateStock((item))


                    }
                  />
                </TableCell>

                {/* EDIT */}
                <TableCell align="right">
                  <IconButton
                    onClick={() =>
                      navigate(`/seller/update-product/${item.id}`)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}