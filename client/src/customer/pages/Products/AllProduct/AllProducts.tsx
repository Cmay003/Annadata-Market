import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Backdrop,
  CircularProgress,
  Pagination,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Drawer,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

import { getAllProducts } from "../../../../Redux Toolkit/Customer/ProductSlice";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/Store";
import ProductCard from "../ProductCard/ProductCard";
import { mainCategory } from "../../../../data/category/mainCategory";

const categoriesList = [
  "all",...mainCategory.map(c => c.categoryId)
];

const AllProducts = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, loading, totalPages } = useAppSelector(
    (state) => state.products
  );

  const isMobile = useMediaQuery("(max-width:768px)");

  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [organic, setOrganic] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);

  // FETCH
  useEffect(() => {
    const params: any = { pageNumber: page - 1 };

    if (category !== "all") params.category = category;
    if (organic) params.organic = true;

    dispatch(getAllProducts(params));

    // setSearchParams({
    //   category: category !== "all" ? category : "",
    // });

    if (category !== "all") {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  }, [dispatch, category, organic, page]);

  if (loading) {
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  }

  // 🔥 FILTER PANEL
  const FilterContent = () => (
    <div className="w-[260px] p-5">
      <h2 className="font-semibold text-lg mb-4">Filters</h2>

      {/* CATEGORY */}
      <div className="mb-5">
        <p className="text-sm mb-2">Category</p>
        <Select
          fullWidth
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
        >
          {categoriesList.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* ORGANIC */}
      <FormControlLabel
        control={
          <Checkbox
            checked={organic}
            onChange={(e) => {
              setPage(1);
              setOrganic(e.target.checked);
            }}
          />
        }
        label="Organic Only"
      />
    </div>
  );

  return (
    <div className="min-h-screen px-3 md:px-6 lg:px-20 py-6 md:py-10">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">
          {category !== "all"
            ? `${category.toUpperCase()} PRODUCTS`
            : "ALL PRODUCTS"}
        </h1>

        {/* MOBILE FILTER BUTTON */}
        {isMobile && (
          <IconButton onClick={() => setOpenFilter(true)}>
            <FilterListIcon />
          </IconButton>
        )}
      </div>

      <div className="flex gap-6">

        {/* DESKTOP FILTER */}
        {!isMobile && (
          <div className="hidden md:block w-[260px] bg-white rounded-lg shadow-md h-fit">
            <FilterContent />
          </div>
        )}

        {/* PRODUCTS */}
        <div className="flex-1">

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((item: any, index: number) => (
                <ProductCard key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <img
                className="w-60 md:w-72"
                src="https://cdn.pixabay.com/photo/2022/05/28/10/45/oops-7227010_960_720.png"
              />
              <h2 className="text-lg md:text-xl font-semibold mt-4">
                No Products Available 😢
              </h2>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-10">
              <Pagination
                page={page}
                onChange={(_, value) => setPage(value)}
                count={totalPages}
                color="primary"
              />
            </div>
          )}
        </div>
      </div>

      {/* 🔥 MOBILE FILTER DRAWER */}
      <Drawer
        anchor="left"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
      >
        <FilterContent />
      </Drawer>
    </div>
  );
};

export default AllProducts;