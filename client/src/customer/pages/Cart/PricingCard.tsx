

import { Divider } from "@mui/material";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const PricingCard = () => {

  const { cart } = useAppSelector((store) => store);

  // const subtotal = cart.cart?.totalMrpPrice || 0;

  // const finalPrice = cart.cart?.totalSellingPrice || 0;

  // const couponDiscount = cart.cart?.couponPrice || 0;

  // const productDiscount = subtotal - finalPrice;

  // // backend default delivery fee
  // const deliveryFee = 20;

  // // backend platform fee
  // const platformFee =
  //   (finalPrice * 5) / 100;

  // const total =
  //   finalPrice +
  //   deliveryFee +
  //   platformFee -
  //   couponDiscount;


  const subtotal =
  cart.cart?.totalMrpPrice || 0;

const sellingPrice =
  cart.cart?.totalSellingPrice || 0;

const couponDiscount =
  cart.cart?.couponPrice || 0;

const deliveryFee =
  cart.cart?.deliveryCharge || 0;

const finalAmount =
  cart.cart?.finalAmount || 0;

const productDiscount =
  subtotal - sellingPrice;

  return (
    <div>

      <div className="space-y-3 p-5">

        {/* SUBTOTAL */}
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span>₹ {subtotal}</span>
        </div>

        {/* PRODUCT DISCOUNT */}
        <div className="flex justify-between items-center text-green-600">
          <span>Product Discount</span>
          <span>- ₹ {productDiscount}</span>
        </div>

        {/* COUPON */}
        {couponDiscount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span>Coupon Discount</span>
            <span>- ₹ {couponDiscount}</span>
          </div>
        )}

        {/* DELIVERY */}
        <div className="flex justify-between items-center">
          <span>Delivery Fee</span>
          <span>₹ {deliveryFee}</span>
        </div>

        {/* PLATFORM */}
        {/* <div className="flex justify-between items-center">
          <span>Platform Fee</span>
          <span>₹ {platformFee.toFixed(2)}</span>
        </div> */}

      </div>

      <Divider />

      {/* FINAL TOTAL */}
      <div className="font-bold text-lg px-5 py-4 flex justify-between items-center">
        <span>Total</span>
        {/* <span>₹ {total.toFixed(2)}</span> */}
        <span>₹ {finalAmount.toFixed(2)}</span>
      </div>

    </div>
  );
};

export default PricingCard;