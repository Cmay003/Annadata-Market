
import React, { useState } from "react";
import "./ProductCard.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../../types/productTypes";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/Store";
import { addProductToWishlist } from "../../../../Redux Toolkit/Customer/WishlistSlice";
import { addItemToCart } from "../../../../Redux Toolkit/Customer/CartSlice";
import { isWishlisted } from "../../../../util/isWishlisted";

interface ProductCardProps {
  item: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((store) => store);
  const { cart } = useAppSelector((store) => store);

  const user = useAppSelector((store) => store.user);

  const [quantity] = useState(1);

  const handleAddWishlist = (e: any) => {
    e.stopPropagation();
    if (item.id) dispatch(addProductToWishlist({ productId: item.id }));
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();


    if (!user.user) {
      navigate("/login");
      return;
    }
    if (!item.id) return;

    dispatch(
      addItemToCart({
        jwt: localStorage.getItem("jwt"),
        request: {
          productId: item.id,
          quantity,
          weight: 1,
          unit: "kg",
        },
      })
    );
  };

  // const isInCart = cart?.cartItems?.some(
  //   (cartItem: any) => cartItem.product?.id === item.id
  // );
  const isInCart = cart.cart?.cartItems?.some(
  (cartItem: any) => cartItem.product?.id === item.id
);

  return (
    // <div
    //   onClick={() =>

    //     navigate(`/product-details/${item.category?.categoryId}/${item.title}/${item.id}`)
    //   }
    //   className="product-card"
    // >

    <div
      onClick={() => {
        if (!item.in_stock) return; // ❌ CLICK BLOCK
        navigate(`/product-details/${item.category?.categoryId}/${item.title}/${item.id}`);
      }}
      className={`product-card ${!item.in_stock ? "disabled-card" : ""}`}
    >
      {/* IMAGE */}
      <div className="product-image"
      >
        <img src={item.images[0]} alt={item.title} />

        {!item.in_stock && (
          <div className="out-of-stock-overlay">
            Out of Stock
          </div>
        )}

        {/* Wishlist Icon */}
        <IconButton
          className="wishlist-btn"
          onClick={handleAddWishlist}
          disabled={!item.in_stock}
        >
          {wishlist.wishlist && isWishlisted(wishlist.wishlist, item) ? (
            <FavoriteIcon sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>

        {/* Discount Badge */}
        {item.discountPercent && (
          <span className="discount-badge">
            {item.discountPercent}% OFF
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="product-details">
        <h3 className="product-title">{item.title}</h3>

        <p className="product-seller">
          {item.seller?.businessDetails.businessName}
        </p>

        {/* PRICE */}
        <div className="price-section">
          <span className="price">₹{item.sellingPrice}</span>
          <span className="mrp">₹{item.mrpPrice}</span>
        </div>

        {/* ADD TO CART */}
        {/* <Button
          fullWidth
          variant="contained"
          className="add-btn"
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button> */}

        {/* <Button
          fullWidth
          variant="contained"
          className="add-btn"
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={!item.in_stock}
        >
          {item.in_stock ? "Add to Cart" : "Out of Stock"}
        </Button> */}

        <Button
          fullWidth
          variant="contained"
          className="add-btn"
          startIcon={<AddShoppingCartIcon />}
          onClick={(e) => {
            if (isInCart) {
              navigate("/cart"); // 👉 GO TO CART
            } else {
              handleAddToCart(e); // 👉 ADD TO CART
            }
          }}
          disabled={!item.in_stock}
        >
          {!item.in_stock
            ? "Out of Stock"
            : isInCart
              ? "Go to Cart"
              : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;