package com.kirana.store.rest_services.tutorials.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
public class Users {

    @Getter
    @Setter
    @JsonIgnore
    @GeneratedValue
    @Id
    private Integer id;

    @Getter
    @Setter
    @Size(min = 2)
    private String name;

    @Getter
    @Setter
    @Column(unique = true, nullable = false)
    private Long mobileNo;

    // @JsonIgnore
    // @OneToMany(mappedBy = "users")
    // @Getter
    // @Setter
    // private List<Purchase> purchases;

}
