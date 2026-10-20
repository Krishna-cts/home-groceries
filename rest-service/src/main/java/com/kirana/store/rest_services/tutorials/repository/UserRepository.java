package com.kirana.store.rest_services.tutorials.repository;

import com.kirana.store.rest_services.tutorials.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Integer> {

    Users findByName(String name);
}