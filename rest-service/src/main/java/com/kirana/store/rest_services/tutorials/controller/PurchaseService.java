package com.kirana.store.rest_services.tutorials.controller;

import com.kirana.store.rest_services.tutorials.models.Purchase;
import com.kirana.store.rest_services.tutorials.repository.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PurchaseService {

    @Autowired
    PurchaseRepository purchaseRepository;

    static List<Purchase> staticPurchase = new ArrayList<>();
    static int purchaseCount = 0;

    static {
        Purchase purchase1 = new Purchase(++purchaseCount, "Cashews", LocalDate.of(2025, 8, 1), "Market", 900.0d, 1.0d);
        Purchase purchase2 = new Purchase(++purchaseCount, "Cashews", LocalDate.of(2024, 1, 1), "Flipkart", 850.0d, 1.0d);
        Purchase purchase3 = new Purchase(++purchaseCount, "Walnuts", LocalDate.of(2024, 1, 1), "Dmart", 850.0d, 1.0d);

        staticPurchase.add(purchase1);
        staticPurchase.add(purchase2);
        staticPurchase.add(purchase3);
    }

    public Purchase getCheapestWithinX_Months(String product, int months) {
        return staticPurchase.stream().filter(p1 ->
                getBetween(p1).getYears() * 12 + getBetween(p1).getMonths() < months && p1.getProductName().equals(product)
        ).min(Comparator.comparingDouble(Purchase::getCost)).get();
    }

    private static Period getBetween(Purchase p1) {
        return Period.between(p1.getDate(), LocalDate.now());
    }

    public Purchase getCheapest(String product) {
        return staticPurchase.stream().filter(p ->
                p.getProductName().equals(product)
        ).min(Comparator.comparingDouble(Purchase::getCost)).get();
    }

    public Purchase getLatestPurchaseForAProduct(String product) {
        return staticPurchase.stream().filter(p ->
                p.getProductName().equals(product)
        ).max(Comparator.naturalOrder()).orElse(null);
    }

    public void deletePurchase(int id) {
        staticPurchase.removeIf(p -> p.getPurchaseId() == id);
    }

    public List<Purchase> getPurchaseList() {
        return staticPurchase;
    }

    public void save(Purchase p) {
        p.setPurchaseId(++purchaseCount);
        staticPurchase.add(p);
    }

    public List<String> getPurchaseListForUsers(List<Purchase> purchases) {
        return purchases.stream().map(purchase ->
                "You have purchased " + purchase.getQuantity() + " units of " + purchase.getProductName() +
                        " at the cost of " + purchase.getCost() + " per unit from " + purchase.getVendor()
        ).collect(Collectors.toList());
    }

    public Optional<Purchase> getCheapestFromRepository(String product) {
        return purchaseRepository.findByProductName(product).stream()
                .min(Comparator.comparingDouble(Purchase::getCost));
    }

    public Optional<Purchase> getCheapestWithinX_MonthsFromRepository(String product, long months) {
        return purchaseRepository.findByProductName(product).stream()
                .filter(p -> p.getDate().isAfter(LocalDate.now().minusMonths(months)))
                .min(Comparator.comparingDouble(Purchase::getCost));
    }

    public Optional<Purchase> findRecentPurchase(String product) {
        return purchaseRepository.findByProductName(product).stream()
                .max(Comparator.comparing(Purchase::getDate));
    }
}

