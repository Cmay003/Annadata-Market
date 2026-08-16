package com.zosh.controller;

import com.zosh.model.DeliveryBoy;
import com.zosh.repository.DeliveryBoyRepository;
import com.zosh.response.ApiResponse;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/delivery")
@RequiredArgsConstructor
public class AdminDeliveryController {

    private final DeliveryBoyRepository deliveryBoyRepository;

    // ─── Get all delivery persons ─────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<DeliveryBoy>> getAll() {
        return ResponseEntity.ok(deliveryBoyRepository.findAll());
    }

    // ─── Get by ID ────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryBoy> getById(@PathVariable Long id) {
        return deliveryBoyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ─── Create (Admin adds delivery person manually) ─────────────────────
    @PostMapping
    public ResponseEntity<DeliveryBoy> create(@RequestBody DeliveryBoy boy) {
        return ResponseEntity.ok(deliveryBoyRepository.save(boy));
    }

    // ─── Toggle active/inactive ───────────────────────────────────────────
    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryBoy> toggleStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status) {
        DeliveryBoy boy = deliveryBoyRepository.findById(id).orElseThrow();
        if (status != null) {
            boy.setDeliveryStatus(status);
            boy.setIsActive(!"OFFLINE".equals(status));
        } else {
            boy.setIsActive(!boy.getIsActive());
        }
        return ResponseEntity.ok(deliveryBoyRepository.save(boy));
    }

    // ─── Approve account ──────────────────────────────────────────────────
    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApiResponse> approve(@PathVariable Long id) {
        Optional<DeliveryBoy> opt = deliveryBoyRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        DeliveryBoy boy = opt.get();
        boy.setAccountStatus(com.zosh.domain.AccountStatus.ACTIVE);
        boy.setIsActive(true);
        deliveryBoyRepository.save(boy);
        return ResponseEntity.ok(new ApiResponse("Delivery person approved", true));
    }

    // ─── Delete ───────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        deliveryBoyRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse("Deleted successfully", true));
    }
}