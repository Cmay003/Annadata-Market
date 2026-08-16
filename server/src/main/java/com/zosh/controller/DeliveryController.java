package com.zosh.controller;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.zosh.config.JwtProvider;
import com.zosh.domain.AccountStatus;
import com.zosh.domain.DeliveryStatus;
import com.zosh.domain.OrderStatus;
import com.zosh.domain.USER_ROLE;
import com.zosh.model.DeliveryBoy;
import com.zosh.model.Order;
import com.zosh.repository.DeliveryBoyRepository;
import com.zosh.repository.OrderRepository;
import com.zosh.response.ApiResponse;
import com.zosh.response.AuthResponse;
import com.zosh.service.EmailService;
import com.zosh.service.impl.CustomeUserServiceImplementation;
import com.zosh.utils.OtpUtils;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryBoyRepository deliveryBoyRepository;
    private final OrderRepository orderRepository;
    private final JwtProvider jwtProvider;
    private final CustomeUserServiceImplementation userService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // ─── Public: Signup ──────────────────────────────────────────────────
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody DeliveryBoy req) {
        if (deliveryBoyRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("An account with this email already exists.", false));
        }

        DeliveryBoy boy = new DeliveryBoy();
        boy.setName(req.getName());
        boy.setEmail(req.getEmail());
        boy.setPassword(passwordEncoder.encode(req.getPassword()));
        boy.setPhone(req.getPhone());
        boy.setVehicleType(req.getVehicleType());
        boy.setVehicleNumber(req.getVehicleNumber());
        boy.setCurrentCity(req.getCurrentCity());
        boy.setCurrentPincode(req.getCurrentPincode());
        boy.setRole(USER_ROLE.ROLE_DELIVERY);
        boy.setAccountStatus(AccountStatus.PENDING_VERIFICATION);
        boy.setDeliveryStatus("AVAILABLE");
        boy.setIsActive(true);

        DeliveryBoy saved = deliveryBoyRepository.save(boy);

        Authentication authentication = authenticateDelivery(req.getEmail());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse();
        response.setJwt(token);
        response.setMessage("Delivery account created! Pending admin approval.");
        response.setRole(USER_ROLE.ROLE_DELIVERY);

        log.info("New delivery person registered: {}", req.getEmail());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ─── Public: Login ───────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody DeliveryBoy req) {
        DeliveryBoy boy = deliveryBoyRepository.findByEmail(req.getEmail())
                .orElse(null);

        if (boy == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("No account found with this email.", false));
        }
        if (!passwordEncoder.matches(req.getPassword(), boy.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Invalid email or password.", false));
        }

        Authentication authentication = authenticateDelivery(req.getEmail());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse();
        response.setJwt(token);
        response.setMessage("Login successful");
        response.setRole(USER_ROLE.ROLE_DELIVERY);
        response.setStatus(boy.getAccountStatus() == AccountStatus.ACTIVE);

        log.info("Delivery person logged in: {}", req.getEmail());
        return ResponseEntity.ok(response);
    }

    // ─── Protected: Own profile ──────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String jwt) {
        String email = extractEmail(jwt);
        DeliveryBoy boy = deliveryBoyRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Delivery person not found"));
        return ResponseEntity.ok(boy);
    }

    // ─── Public: Reset password (dev/recovery) ────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> req) {
        String email = req.get("email");
        String newPassword = req.get("newPassword");
        if (email == null || newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Email and newPassword (min 6 chars) are required.", false));
        }
        DeliveryBoy boy = deliveryBoyRepository.findByEmail(email).orElse(null);
        if (boy == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("No delivery account found with email: " + email, false));
        }
        boy.setPassword(passwordEncoder.encode(newPassword));
        deliveryBoyRepository.save(boy);
        log.info("Delivery account password reset for: {}", email);
        return ResponseEntity.ok(new ApiResponse("Password reset successfully. You can now login with the new password.", true));
    }

    // ─── Protected: Update location ──────────────────────────────────────
    @PatchMapping("/location")
    public ResponseEntity<?> updateLocation(
            @RequestHeader("Authorization") String jwt,
            @RequestBody DeliveryBoy req) {
        String email = extractEmail(jwt);
        DeliveryBoy boy = deliveryBoyRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Not found"));
        if (req.getLatitude() != null)     boy.setLatitude(req.getLatitude());
        if (req.getLongitude() != null)    boy.setLongitude(req.getLongitude());
        if (req.getCurrentCity() != null)  boy.setCurrentCity(req.getCurrentCity());
        if (req.getCurrentPincode() != null) boy.setCurrentPincode(req.getCurrentPincode());
        deliveryBoyRepository.save(boy);
        return ResponseEntity.ok(new ApiResponse("Location updated", true));
    }

    // ─── Protected: Update delivery status ───────────────────────────────
    @PatchMapping("/status")
    public ResponseEntity<?> updateDeliveryStatus(
            @RequestHeader("Authorization") String jwt,
            @RequestParam String status) {
        String email = extractEmail(jwt);
        DeliveryBoy boy = deliveryBoyRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Not found"));
        boy.setDeliveryStatus(status);
        deliveryBoyRepository.save(boy);
        return ResponseEntity.ok(new ApiResponse("Status updated to " + status, true));
    }

    // ─── Protected: My assigned orders ───────────────────────────────────
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(@RequestHeader("Authorization") String jwt) {
        String email = extractEmail(jwt);
        DeliveryBoy boy = deliveryBoyRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Not found"));
        List<Order> orders = orderRepository.findByDeliveryBoyId(boy.getId());
        return ResponseEntity.ok(orders);
    }

    // ─── Protected: Nearby orders ready for pickup (route optimizer) ────────
    @GetMapping("/nearby-orders")
    public ResponseEntity<List<Order>> getNearbyOrders(@RequestHeader("Authorization") String jwt) {
        String email = extractEmail(jwt);
        DeliveryBoy boy = deliveryBoyRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Not found"));

        // Show READY_FOR_PICKUP orders with no delivery boy assigned yet
        List<Order> available = orderRepository.findAll().stream()
                .filter(o -> OrderStatus.READY_FOR_PICKUP.equals(o.getOrderStatus()))
                .filter(o -> o.getDeliveryBoyId() == null)
                .filter(o -> {
                    if (boy.getCurrentCity() != null && o.getShippingAddress() != null) {
                        return boy.getCurrentCity().equalsIgnoreCase(o.getShippingAddress().getCity());
                    }
                    return true; // if no city set, show all
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(available);
    }

    // ─── Protected: Accept an order (assign delivery boy) ────────────────
    @PutMapping("/orders/{orderId}/accept")
    public ResponseEntity<?> acceptOrder(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long orderId) {
        String email = extractEmail(jwt);
        DeliveryBoy boy = deliveryBoyRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Not found"));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getDeliveryBoyId() != null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Order already assigned to another delivery person.", false));
        }

        order.setDeliveryBoyId(boy.getId());
        order.setDeliveryStatus(DeliveryStatus.ASSIGNED);
        boy.setDeliveryStatus("ON_DELIVERY");
        deliveryBoyRepository.save(boy);
        orderRepository.save(order);
        log.info("Order {} accepted by delivery boy {}", orderId, boy.getEmail());
        return ResponseEntity.ok(new ApiResponse("Order accepted — go pick it up from the farmer!", true));
    }

    // ─── Protected: Pickup order from farmer ─────────────────────────────
    // After physical pickup, mark IN_TRANSIT and send OTP to customer
    @PutMapping("/orders/{orderId}/pickup")
    public ResponseEntity<?> pickupOrder(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long orderId) {
        String email = extractEmail(jwt);
        DeliveryBoy boy = deliveryBoyRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Not found"));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!boy.getId().equals(order.getDeliveryBoyId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse("This order is not assigned to you.", false));
        }

        // Generate 6-digit OTP
        String otp = OtpUtils.generateOTP();
        order.setDeliveryOtp(otp);
        order.setOtpUsed(false);
        order.setOrderStatus(OrderStatus.IN_TRANSIT);
        order.setDeliveryStatus(DeliveryStatus.OUT_FOR_DELIVERY);
        orderRepository.save(order);

        // Email OTP to customer
        if (order.getUser() != null && order.getUser().getEmail() != null) {
            try {
                String subject = "🚚 Your Annadata Order is Out for Delivery!";
                String text = String.format(
                    "Your order #%s is on the way!\n\n" +
                    "Please share this OTP with the delivery person to confirm receipt:\n\n" +
                    "   Delivery OTP: %s\n\n" +
                    "Do NOT share this OTP with anyone other than your delivery partner.\n\n" +
                    "— Annadata Market Team",
                    order.getOrderId() != null ? order.getOrderId() : order.getId(),
                    otp
                );
                emailService.sendVerificationOtpEmail(order.getUser().getEmail(), "", subject, text);
                log.info("Delivery OTP sent to customer {} for order {}", order.getUser().getEmail(), orderId);
            } catch (Exception e) {
                log.warn("Could not send OTP email for order {}: {}", orderId, e.getMessage());
                // Don't fail the request — OTP is still visible in order details
            }
        }

        log.info("Order {} picked up by delivery boy {}, OTP generated", orderId, boy.getEmail());
        return ResponseEntity.ok(new ApiResponse("Order picked up! OTP sent to customer.", true));
    }

    // ─── Protected: Complete delivery — OTP verified ──────────────────────
    @PutMapping("/orders/{orderId}/complete")
    public ResponseEntity<?> completeOrder(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long orderId,
            @RequestBody Map<String, String> body) {
        String email = extractEmail(jwt);
        DeliveryBoy boy = deliveryBoyRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Not found"));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!boy.getId().equals(order.getDeliveryBoyId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse("This order is not assigned to you.", false));
        }

        // ── OTP Verification ────────────────────────────────────────────
        String submittedOtp = body.get("otp");
        if (submittedOtp == null || submittedOtp.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("OTP is required to complete delivery.", false));
        }
        if (Boolean.TRUE.equals(order.getOtpUsed())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("OTP already used for this order.", false));
        }
        if (!submittedOtp.trim().equals(order.getDeliveryOtp())) {
            log.warn("Wrong OTP for order {} — submitted: {}", orderId, submittedOtp);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Incorrect OTP. Please ask the customer for the correct code.", false));
        }

        // ── Mark order as delivered ──────────────────────────────────────
        order.setOtpUsed(true);
        order.setOrderStatus(OrderStatus.DELIVERED);
        order.setDeliveryStatus(DeliveryStatus.DELIVERED);
        order.setDeliveredAt(java.time.LocalDateTime.now());

        // ── Credit delivery earnings (70% of delivery charge) ────────────
        boy.setCompletedOrders((boy.getCompletedOrders() == null ? 0 : boy.getCompletedOrders()) + 1);
        boy.setDeliveryStatus("AVAILABLE");
        if (order.getDeliveryCharge() != null) {
            double earned = boy.getTotalEarnings() == null ? 0.0 : boy.getTotalEarnings();
            boy.setTotalEarnings(earned + order.getDeliveryCharge() * 0.7);
        }

        deliveryBoyRepository.save(boy);
        orderRepository.save(order);
        log.info("Order {} delivered successfully by {} (OTP verified)", orderId, boy.getEmail());
        return ResponseEntity.ok(new ApiResponse("Order delivered successfully! 🎉", true));
    }

    // ─── Private helper ──────────────────────────────────────────────────
    private Authentication authenticateDelivery(String email) {
        UserDetails userDetails = userService.loadUserByUsername("delivery_" + email);
        if (userDetails == null) {
            throw new BadCredentialsException("Delivery person not found: " + email);
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    private String extractEmail(String jwt) {
        String raw = jwtProvider.getEmailFromJwtToken(jwt);
        // JWT stores "delivery_email" as subject for delivery persons
        return raw.startsWith("delivery_") ? raw.substring(9) : raw;
    }
}
