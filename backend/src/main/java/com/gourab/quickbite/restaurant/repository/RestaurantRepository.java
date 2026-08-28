package com.gourab.quickbite.restaurant.repository;

import com.gourab.quickbite.restaurant.entity.RestaurantEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RestaurantRepository extends JpaRepository<RestaurantEntity, UUID> {
    Page<RestaurantEntity> findByOpen(boolean open, Pageable pageable);
    Page<RestaurantEntity> findByCityCode(Long cityCode, Pageable pageable);
}
