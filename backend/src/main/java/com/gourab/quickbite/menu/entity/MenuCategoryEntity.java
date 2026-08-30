package com.gourab.quickbite.menu.entity;


import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "menu_categories", schema = "public")
public class MenuCategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "category_id")
    private UUID menuCategoryId;

    @Column(name = "restaurant_id", nullable = false)
    private UUID restaurantId;

    @Column(name = "name", nullable = false)
    private String menuCategoryName;

    @Column(name = "description", nullable = true)
    private String menuCategoryDescription;

    @Column(name = "display_order", nullable = false)
    private Integer menuCategoryDisplayOrder;

    @Column(name = "is_active", nullable = false)
    private Boolean menuCategoryIsActive;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime menuCategoryCreatedTime;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime menuCategoryUpdatedTime;

    protected MenuCategoryEntity() {}

    public UUID getId() {return menuCategoryId;}

    public UUID getRestaurantId() {return restaurantId;}

    public String getMenuCategoryName() {return menuCategoryName;}

    public String getMenuCategoryDescription() {return menuCategoryDescription;}

    public Integer getMenuCategoryDisplayOrder() {return menuCategoryDisplayOrder;}

    public Boolean getMenuCategoryIsActive() {return menuCategoryIsActive;}

    public OffsetDateTime getMenuCategoryCreatedTime() {return menuCategoryCreatedTime;}

    public OffsetDateTime getMenuCategoryUpdatedTime() {return menuCategoryUpdatedTime;}
}
