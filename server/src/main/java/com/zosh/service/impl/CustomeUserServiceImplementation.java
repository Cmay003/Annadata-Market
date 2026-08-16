package com.zosh.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.zosh.domain.USER_ROLE;
import com.zosh.model.DeliveryBoy;
import com.zosh.model.Seller;
import com.zosh.repository.DeliveryBoyRepository;
import com.zosh.repository.SellerRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.zosh.model.User;
import com.zosh.repository.UserRepository;

@Service
public class CustomeUserServiceImplementation implements UserDetailsService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final DeliveryBoyRepository deliveryBoyRepository;

    private static final String SELLER_PREFIX   = "seller_";
    private static final String DELIVERY_PREFIX = "delivery_";

    public CustomeUserServiceImplementation(
            UserRepository userRepository,
            SellerRepository sellerRepository,
            DeliveryBoyRepository deliveryBoyRepository) {
        this.userRepository        = userRepository;
        this.sellerRepository      = sellerRepository;
        this.deliveryBoyRepository = deliveryBoyRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // ── Delivery person ──────────────────────────────────────
        if (username.startsWith(DELIVERY_PREFIX)) {
            String email = username.substring(DELIVERY_PREFIX.length());
            DeliveryBoy boy = deliveryBoyRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException(
                            "Delivery person not found: " + email));
            return buildUserDetails(boy.getEmail(), boy.getPassword(), boy.getRole());
        }

        // ── Seller ───────────────────────────────────────────────
        if (username.startsWith(SELLER_PREFIX)) {
            String email = username.substring(SELLER_PREFIX.length());
            Seller seller = sellerRepository.findByEmail(email);
            if (seller != null) {
                return buildUserDetails(seller.getEmail(), seller.getPassword(), seller.getRole());
            }
        }

        // ── Customer / Admin ─────────────────────────────────────
        User user = userRepository.findByEmail(username);
        if (user != null) {
            return buildUserDetails(user.getEmail(), user.getPassword(), user.getRole());
        }

        throw new UsernameNotFoundException("User not found: " + username);
    }

    private UserDetails buildUserDetails(String email, String password, USER_ROLE role) {
        if (role == null) role = USER_ROLE.ROLE_CUSTOMER;

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.toString()));

        return new org.springframework.security.core.userdetails.User(email, password, authorities);
    }
}
