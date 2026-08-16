package com.zosh.repository;

import com.zosh.domain.AccountStatus;
import com.zosh.model.Seller;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SellerRepository extends JpaRepository<Seller,Long> {

    Seller findByEmail(String email);
    List<Seller> findByAccountStatus(AccountStatus status);




    Optional<Seller> findOptionalByEmail(String email);

    boolean existsByEmail(String email);

}
