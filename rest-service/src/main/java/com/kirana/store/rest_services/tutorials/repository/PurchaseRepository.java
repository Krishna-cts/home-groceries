package com.kirana.store.rest_services.tutorials.repository;

import com.kirana.store.rest_services.tutorials.models.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PurchaseRepository
        extends JpaRepository<Purchase, Integer> {

    Optional<Purchase> findByProductNameAndVendorAndDate(
            String productName,
            String vendor,
            LocalDate date
    );

    List<Purchase> findByProductName(
            String productName
    );

    List<Purchase> findByPurchasedBy(
            String purchasedBy
    );

    List<Purchase> findByProductNameContainingIgnoreCase(
            String product
    );

    List<Purchase> findByDateBetween(
            LocalDate start,
            LocalDate end
    );

    List<Purchase> findByProductNameContainingIgnoreCaseAndDateBetween(
            String product,
            LocalDate start,
            LocalDate end
    );
}