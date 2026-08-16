package com.zosh.domain;

public enum AccountStatus {
    PENDING_ONBOARDING,   // Account created but onboarding not completed
    PENDING_VERIFICATION, // Onboarding done, waiting for admin/PAN verification
    ACTIVE,               // Account is active and in good standing
    SUSPENDED,            // Account is temporarily suspended
    DEACTIVATED,          // Account is deactivated by user
    BANNED,               // Account is permanently banned
    CLOSED                // Account is permanently closed
}

