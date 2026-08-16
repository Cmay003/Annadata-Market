package com.zosh.model;

import com.zosh.domain.AccountStatus;
import com.zosh.domain.USER_ROLE;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sellerName;

    private String mobile;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    // ─── Tax Details ──────────────────────────────────────────
    private String GSTIN;

    private String panNumber;

    private String panName;

    /** URL / path to uploaded PAN card document */
    private String panDocumentUrl;

    @Enumerated(EnumType.STRING)
    private PanVerificationStatus panVerificationStatus = PanVerificationStatus.PENDING;

    // ─── Business / Store Details ──────────────────────────────
    @Embedded
    private BusinessDetails businessDetails = new BusinessDetails();

    // ─── Pickup Address ────────────────────────────────────────
    @OneToOne(cascade = CascadeType.ALL)
    private Address pickupAddress = new Address();

    // ─── Bank Details ──────────────────────────────────────────
    @Embedded
    private BankDetails bankDetails = new BankDetails();

    // ─── Auth / Status ─────────────────────────────────────────
    private USER_ROLE role = USER_ROLE.ROLE_SELLER;

    private Boolean isEmailVerified = false;

    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus = AccountStatus.PENDING_ONBOARDING;

    /** Inner enum for PAN verification state */
    public enum PanVerificationStatus {
        PENDING, VERIFIED, REJECTED
    }
}
