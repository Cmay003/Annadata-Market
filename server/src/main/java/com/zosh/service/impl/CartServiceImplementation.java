package com.zosh.service.impl;

import org.springframework.stereotype.Service;

import com.zosh.exception.ProductException;
import com.zosh.model.Cart;
import com.zosh.model.CartItem;
import com.zosh.model.CommissionSetting;
import com.zosh.model.Product;
import com.zosh.model.User;
import com.zosh.repository.CartItemRepository;
import com.zosh.repository.CartRepository;
import com.zosh.repository.CommissionSettingRepository;
import com.zosh.service.CartService;
import com.zosh.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImplementation implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    private final CommissionSettingRepository commissionRepo;

    @Override
    public Cart findUserCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());

        CommissionSetting setting
                = commissionRepo
                        .findTopByOrderByCreatedAtDesc()
                        .orElse(new CommissionSetting());

        // double deliveryCharge = 0;
        int deliveryCharge
                = setting.getDeliveryCharge();

        // int totalPrice = 0;
        // int totalDiscountedPrice = 0;
        // int totalItem = 0;
        // double subtotal
        //         = totalDiscountedPrice
        //         - cart.getCouponPrice();
        // for (CartItem cartsItem : cart.getCartItems()) {
        //     totalPrice += cartsItem.getMrpPrice();
        //     totalDiscountedPrice += cartsItem.getSellingPrice();
        //     totalItem += cartsItem.getQuantity();
        // }
        // cart.setTotalMrpPrice(totalPrice);
        // cart.setTotalItem(cart.getCartItems().size());
        // // cart.setTotalSellingPrice(totalDiscountedPrice - cart.getCouponPrice());
        // double finalAmount
        //         = totalDiscountedPrice
        //         + deliveryCharge
        //         - cart.getCouponPrice();
        // cart.setDeliveryCharge(
        //         deliveryCharge
        // );
        // cart.setFinalAmount(
        //         finalAmount
        // );
        // cart.setTotalSellingPrice(
        //         totalDiscountedPrice
        // );
        // cart.setDiscount(calculateDiscountPercentage(totalPrice, totalDiscountedPrice));
        // cart.setTotalItem(totalItem);
        // if (subtotal < setting.getFreeDeliveryAbove()) {
        //     deliveryCharge = setting.getDeliveryCharge();
        // }
        // cart.setDeliveryCharge(deliveryCharge);
        // cart.setTotalSellingPrice(subtotal);
        // cart.setFinalAmount(finalAmount);
//         int totalPrice = 0;
//         int totalDiscountedPrice = 0;
//         int totalItem = 0;
//         for (CartItem cartItem : cart.getCartItems()) {
//             totalPrice += cartItem.getMrpPrice();
//             totalDiscountedPrice += cartItem.getSellingPrice();
//             totalItem += cartItem.getQuantity();
//         }
//         double subtotal
//                 = totalDiscountedPrice
//                 - cart.getCouponPrice();
// // double deliveryCharge = 0;
//         if (subtotal < setting.getFreeDeliveryAbove()) {
//             deliveryCharge = setting.getDeliveryCharge();
//         }
//         double finalAmount
//                 = subtotal + deliveryCharge;
//         cart.setTotalMrpPrice(totalPrice);
//         cart.setTotalSellingPrice(totalDiscountedPrice);
//         cart.setTotalItem(totalItem);
//         cart.setDiscount(
//                 calculateDiscountPercentage(
//                         totalPrice,
//                         totalDiscountedPrice
//                 )
//         );
//         cart.setDeliveryCharge(deliveryCharge);
//         cart.setFinalAmount(finalAmount);
        int totalPrice = 0;
        int totalDiscountedPrice = 0;
        int totalItem = 0;

        for (CartItem cartItem : cart.getCartItems()) {

            totalPrice += cartItem.getMrpPrice();
            totalDiscountedPrice += cartItem.getSellingPrice();
            totalItem += cartItem.getQuantity();
        }

        double subtotal
                = totalDiscountedPrice
                - cart.getCouponPrice();

        // int deliveryCharge = 0;
        if (subtotal < setting.getFreeDeliveryAbove()) {
            deliveryCharge = setting.getDeliveryCharge();
        }

        double finalAmount
                = subtotal + deliveryCharge;

        cart.setTotalMrpPrice(totalPrice);

        cart.setTotalSellingPrice(
                totalDiscountedPrice
        );

        cart.setTotalItem(totalItem);

        cart.setDiscount(
                calculateDiscountPercentage(
                        totalPrice,
                        totalDiscountedPrice
                )
        );

        cart.setDeliveryCharge(
                deliveryCharge
        );

        cart.setFinalAmount(
                finalAmount
        );

        return cartRepository.save(cart);

    }

    public static int calculateDiscountPercentage(double mrpPrice, double sellingPrice) {
        if (mrpPrice <= 0) {
            return 0;
        }
        double discount = mrpPrice - sellingPrice;
        double discountPercentage = (discount / mrpPrice) * 100;
        return (int) discountPercentage;
    }

//     @Override
//     public CartItem addCartItem(User user,
//             Product product,
//             String size,
//             int quantity
//     ) throws ProductException {
//         Cart cart = findUserCart(user);

//         // CartItem isPresent = cartItemRepository.findByCartAndProductAndSize(
//         //         cart, product, size);
//         CartItem isPresent
//                 = cartItemRepository.findByCartAndProduct(
//                         cart,
//                         product);

//         if (isPresent == null) {
//             CartItem cartItem = new CartItem();
//             cartItem.setProduct(product);

//             cartItem.setQuantity(quantity);
//             cartItem.setUserId(user.getId());

//             int totalPrice = quantity * product.getSellingPrice();
//             cartItem.setSellingPrice(totalPrice);
//             cartItem.setMrpPrice(quantity * product.getMrpPrice());
//             cartItem.setSize(size);

//             cart.getCartItems().add(cartItem);
//             cartItem.setCart(cart);

//             return cartItemRepository.save(cartItem);
//         }

//         return isPresent;
//     }
@Override
public CartItem addCartItem(
        User user,
        Product product,
        String size,
        int quantity,Integer weight,
    String unit)
        throws ProductException {

    Cart cart = findUserCart(user);

    CartItem isPresent =
            cartItemRepository.findByCartAndProductAndWeightAndUnit(
                    cart,
                    product, weight,
        unit);

    if (isPresent != null) {

        isPresent.setQuantity(
                isPresent.getQuantity() + quantity
        );

        isPresent.setSellingPrice(
                isPresent.getQuantity()
                        * product.getSellingPrice()
        );

        isPresent.setMrpPrice(
                isPresent.getQuantity()
                        * product.getMrpPrice()
        );


        return cartItemRepository.save(isPresent);
    }

    CartItem cartItem = new CartItem();

    cartItem.setCart(cart);

    cartItem.setProduct(product);

    cartItem.setQuantity(quantity);

    cartItem.setUserId(user.getId());

    cartItem.setSize(size);

    cartItem.setSellingPrice(
            quantity * product.getSellingPrice()
    );

    cartItem.setMrpPrice(
            quantity * product.getMrpPrice()
    );

    cartItem.setWeight(weight);
cartItem.setUnit(unit);

    return cartItemRepository.save(cartItem);
}

}
