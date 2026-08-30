package com.gourab.quickbite.restaurant.repository;

import com.gourab.quickbite.restaurant.entity.RestaurantEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.UUID;

public interface RestaurantRepository extends JpaRepository<RestaurantEntity, UUID> {
    @Query("""
        SELECT restaurant
        FROM RestaurantEntity restaurant
        WHERE (:open IS NULL OR restaurant.open = :open)
          AND (:pureVeg IS NULL OR restaurant.pureVeg = :pureVeg)
          AND (:cityCode IS NULL OR restaurant.cityCode = :cityCode)
          AND (
              :minimumRating IS NULL
              OR restaurant.averageRating >= :minimumRating
          )
          AND (
              :maximumDeliveryMinutes IS NULL
              OR restaurant.maximumDeliveryMinutes <= :maximumDeliveryMinutes
          )
        """)
    Page<RestaurantEntity> findWithFilters(
            @Param("open") Boolean open,
            @Param("pureVeg") Boolean pureVeg,
            @Param("cityCode") Long cityCode,
            @Param("minimumRating") BigDecimal minimumRating,
            @Param("maximumDeliveryMinutes")
            Integer maximumDeliveryMinutes,
            Pageable pageable
    );

}
