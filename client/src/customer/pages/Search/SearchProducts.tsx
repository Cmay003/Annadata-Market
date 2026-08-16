import { useState } from "react";
import type { ChangeEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { searchProduct } from "../../../Redux Toolkit/Customer/ProductSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import ProductCard from "../Products/ProductCard/ProductCard";

const SearchProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductSearch = () => {
    if (!searchQuery.trim()) return;
    dispatch(searchProduct(searchQuery));
  };

  return (
    <div className="min-h-screen px-3 md:px-6 lg:px-20 py-6">

      {/* 🔥 SEARCH BAR */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center w-full md:w-2/3 lg:w-1/2 bg-white shadow-lg rounded-full overflow-hidden">

          <input
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleProductSearch();
            }}
            placeholder="Search fruits, vegetables..."
            className="flex-1 px-4 py-3 outline-none text-sm md:text-base"
          />

          <button
            onClick={handleProductSearch}
            className="bg-[#00927c] text-white px-5 py-3 flex items-center gap-1"
          >
            <SearchIcon />
            <span className="hidden md:block">Search</span>
          </button>
        </div>
      </div>

      {/* 🔥 RESULTS */}
      <section>
        {products.searchProduct?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.searchProduct.map((item: any, index: number) => (
              <ProductCard key={index} item={item} />
            ))}
          </div>
        ) : (
          <div className="h-[65vh] flex flex-col justify-center items-center text-center px-4">
            
            <img
              src="https://cdn-icons-png.flaticon.com/512/751/751463.png"
              className="w-24 md:w-32 mb-4 opacity-70"
            />

            <h1 className="text-xl md:text-3xl font-semibold text-gray-700">
              Search for products
            </h1>

            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Try searching for fruits, vegetables, grains...
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchProducts;