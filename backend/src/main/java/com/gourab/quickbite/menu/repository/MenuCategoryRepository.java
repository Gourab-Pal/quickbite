package com.gourab.quickbite.menu.repository;

import com.gourab.quickbite.menu.entity.MenuCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MenuCategoryRepository extends JpaRepository<MenuCategoryEntity, UUID> {
    @Query("""
        SELECT menuCategory
        FROM MenuCategoryEntity menuCategory
        WHERE menuCategory.restaurantId = :restaurantId
            AND menuCategory.menuCategoryIsActive = true
        ORDER BY menuCategory.menuCategoryDisplayOrder ASC
        """)
    List<MenuCategoryEntity> findActiveCategoriesByRestaurantId(@Param("restaurantId") UUID restaurantId);
}
