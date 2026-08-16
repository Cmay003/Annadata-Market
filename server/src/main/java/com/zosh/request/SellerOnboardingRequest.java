package com.zosh.request;

import com.zosh.model.Address;
import com.zosh.model.BankDetails;
import lombok.Data;

@Data
public class SellerOnboardingRequest {

    // ─── II. Tax Details ──────────────────────────────────────
    private String gstin;
    private String panNumber;
    private String panName;
    /** URL/path to the uploaded PAN document */
    private String panDocumentUrl;

    // ─── III. Store Details ────────────────────────────────────
    private String storeName;

    // ─── IV. Pickup Address ────────────────────────────────────
    private String pincode;
    private String city;
    private String state;
    private String street;   // area / street / locality

    // ─── V. Bank Details ──────────────────────────────────────
    private String accountHolderName;
    private String accountNumber;
    private String ifscCode;
}
