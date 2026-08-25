package com.gourab.quickbite.restaurant.repository;

import com.gourab.quickbite.restaurant.entity.RestaurantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RestaurantRepository extends JpaRepository<RestaurantEntity, UUID> {
}
