package com.kirana.store.rest_services.tutorials.controller;

import com.kirana.store.rest_services.tutorials.exception.NotFoundException;
import com.kirana.store.rest_services.tutorials.models.Purchase;
import com.kirana.store.rest_services.tutorials.repository.PurchaseRepository;
import com.kirana.store.rest_services.tutorials.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@Validated
public class PurchaseController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PurchaseRepository purchaseRepository;

    @Autowired
    com.kirana.store.rest_services.tutorials.service.PurchaseService purchaseService;

    @PostMapping("/purchase/add")
    public ResponseEntity<Object> persistAPurchase(
            @Valid @RequestBody Purchase purchase
    ) {
        purchaseRepository.save(purchase);
        return ResponseEntity.created(null).build();
    }

    @GetMapping("/purchase/fetchAll")
    public List<Purchase> fetchAllPurchases() {
        return purchaseRepository.findAll();
    }

    @GetMapping("/purchase/filter")
    public List<Purchase> filterPurchases(
            @RequestParam(required = false) String product,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate,
            @RequestParam(required = false) String range,
            @RequestParam(required = false) Boolean cheapest
    ) {

        List<Purchase> result;

        // Convert predefined range to dates
        if (range != null && !range.isEmpty()) {
            LocalDate now = LocalDate.now();

            switch (range) {
                case "LAST_WEEK":
                    fromDate = now.minusDays(7);
                    toDate = now;
                    break;

                case "LAST_MONTH":
                    fromDate = now.minusMonths(1);
                    toDate = now;
                    break;

                case "LAST_YEAR":
                    fromDate = now.minusYears(1);
                    toDate = now;
                    break;
            }
        }

        // Apply filters
        if (product != null && fromDate != null && toDate != null) {
            result = purchaseRepository
                    .findByProductNameContainingIgnoreCaseAndDateBetween(
                            product,
                            fromDate,
                            toDate
                    );

        } else if (fromDate != null && toDate != null) {
            result = purchaseRepository.findByDateBetween(fromDate, toDate);

        } else if (product != null && !product.isEmpty()) {
            result = purchaseRepository.findByProductNameContainingIgnoreCase(product);

        } else {
            result = purchaseRepository.findAll();
        }

        // APPLY CHEAPEST FILTER
        if (Boolean.TRUE.equals(cheapest)) {

            Map<String, Optional<Purchase>> cheapestMap =
                    result.stream()
                            .collect(
                                    Collectors.groupingBy(
                                            Purchase::getProductName,
                                            Collectors.minBy(
                                                    Comparator.comparing(
                                                            Purchase::getCost
                                                    )
                                            )
                                    )
                            );

            result = cheapestMap.values()
                    .stream()
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .toList();
        }

        return result;
    }

    @PutMapping("/purchase/update")
    public ResponseEntity<Object> updateAPurchase(
            @Valid @RequestBody Purchase purchase
    ) {

        Optional<Purchase> purchase5 =
                purchaseRepository.findByProductNameAndVendorAndDate(
                        purchase.getProductName(),
                        purchase.getVendor(),
                        purchase.getDate()
                );

        if (purchase5.isPresent()) {
            Purchase existing = purchase5.get();

            existing.setCost(purchase.getCost());

            purchaseRepository.save(existing);
        }

        return ResponseEntity.created(null).build();
    }

    @GetMapping("/purchaseHistoryMonths/{product}/{xMonthsBefore}")
    public List<Purchase> getHistoryOfPurchaseForXMonths(
            @PathVariable String product,
            @PathVariable Long xMonthsBefore
    ) {

        List<Purchase> historyOfPurchases =
                purchaseRepository.findByProductName(product)
                        .stream()
                        .filter(
                                p -> p.getDate().isAfter(
                                        LocalDate.now().minusMonths(xMonthsBefore)
                                )
                        )
                        .collect(Collectors.toList());

        if (historyOfPurchases.isEmpty()) {
            throw new NotFoundException(
                    "No Purchase made for "
                            + product
                            + " in past "
                            + xMonthsBefore
                            + " months"
            );
        }

        return historyOfPurchases;
    }

    @GetMapping("/recentXPurchase/{product}/{max}")
    public List<Purchase> getRecentXPurchase(
            @PathVariable String product,
            @PathVariable @Positive Long max
    ) {

        List<Purchase> historyOfPurchases =
                purchaseRepository.findByProductName(product)
                        .stream()
                        .sorted(
                                (o1, o2) -> o2.getDate().compareTo(o1.getDate())
                        )
                        .limit(max)
                        .collect(Collectors.toList());

        if (historyOfPurchases.isEmpty()) {
            throw new NotFoundException(
                    "No Purchase made for " + product + " in past "
            );
        }

        return historyOfPurchases;
    }

    @GetMapping("/recentPurchase/{product}")
    public Purchase getRecentPurchase(
            @PathVariable String product
    ) {

        Optional<Purchase> purchase =
                purchaseService.findRecentPurchase(product);

        if (purchase.isEmpty()) {
            throw new NotFoundException(
                    "No Recent Purchase " + product
            );
        }

        return purchase.get();
    }

    @GetMapping("/fetchCheapestPurchase/{product}")
    public Purchase getCheapestPurchase(
            @PathVariable String product
    ) {

        Optional<Purchase> purchase =
                purchaseService.getCheapestFromRepository(product);

        if (purchase.isEmpty()) {
            throw new NotFoundException(
                    "product is not purchased :" + product
            );
        }

        return purchase.get();
    }

    @GetMapping("/fetchCheapestPurchase/{product}/{months}")
    public Purchase getCheapestWithinX_Months(
            @PathVariable String product,
            @PathVariable Long months
    ) {

        Optional<Purchase> purchase =
                purchaseService.getCheapestWithinX_MonthsFromRepository(
                        product,
                        months
                );

        if (purchase.isEmpty()) {
            throw new NotFoundException(
                    "product is not purchased :"
                            + product
                            + " in "
                            + months
                            + " months"
            );
        }

        return purchase.get();
    }

    @GetMapping("/me")
    public Map<String, Object> me(
            @AuthenticationPrincipal Jwt jwt
    ) {

        if (jwt == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "No JWT found"
            );
        }

        String username = jwt.getClaimAsString("username");

        if (username == null || username.isBlank()) {
            username = jwt.getSubject();
        }

        List<String> groups =
                jwt.getClaimAsStringList("cognito:groups");

        if (groups == null) {
            groups = Collections.emptyList();
        }

        Map<String, Object> resp = new LinkedHashMap<>();

        resp.put("username", username);
        resp.put("groups", groups);

        return resp;
    }

    @GetMapping("/purchase/fetchCHMine")
    public List<Purchase> fetchForAUser(
            @AuthenticationPrincipal Jwt jwt
    ) {

        if (jwt == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "No JWT found"
            );
        }

        String username = jwt.getClaimAsString("username");

        if (username == null || username.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "User Name is Not Found"
            );
        }

        return purchaseRepository.findByPurchasedBy(username);
    }
}