package com.kirana.store.rest_services.tutorials.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
//@JsonFilter("CheapestProductFilter")
@Entity
@Table(name = "purchase", uniqueConstraints = @UniqueConstraint(columnNames = {"productName", "date", "vendor"}))
public class Purchase implements Comparable<Purchase> {

    @Getter
    @Setter
    @JsonIgnore
    @Id
    @GeneratedValue
    private int purchaseId;

    @Getter
    @Setter
    @Size(min = 3)
    @NotNull
    private String productName;

    @Getter
    @Setter
    @PastOrPresent
    @JsonProperty("purchaseDate")
    private LocalDate date;

    @Getter
    @Setter
    @Size(min = 3)
    @NotNull
    private String vendor;

    @Getter
    @Setter
    @Positive(message = "Cost should be a positive value")
    private Double cost;

    @Getter
    @Setter
    @Positive(message = "Quantity cannot be negative or zero")
    private Double quantity;

    @Getter
    @Setter
    @NotNull
    private String paymentMode;

    @Getter
    @Setter
    @NotNull
    private String purchasedBy;

    public Purchase(int purchaseId, String productName, LocalDate date, String vendor, double cost, double quantity) {
        this.purchaseId = purchaseId;
        this.productName = productName;
        this.date = date;
        this.vendor = vendor;
        this.cost = cost;
        this.quantity = quantity;
    }

    @Override
    public int compareTo(Purchase p) {
        return this.getDate().compareTo(p.getDate());
    }
}
