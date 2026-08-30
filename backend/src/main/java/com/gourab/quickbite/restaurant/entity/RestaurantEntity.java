package com.gourab.quickbite.restaurant.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "restaurants", schema = "public")
public class RestaurantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String name;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(nullable = false, columnDefinition = "text[]")
    private String[] cuisines;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "area_code", nullable = false)
    private Long areaCode;

    @Column(nullable = false)
    private String area;

    @Column(name = "city_code", nullable = false)
    private Long cityCode;

    @Column(nullable = false)
    private String city;

    @Column(name = "average_rating", nullable = false)
    private BigDecimal averageRating;

    @Column(name = "total_ratings", nullable = false)
    private Long totalRatings;

    @Column(name = "minimum_delivery_minutes", nullable = false)
    private Integer minimumDeliveryMinutes;

    @Column(name = "maximum_delivery_minutes", nullable = false)
    private Integer maximumDeliveryMinutes;

    @Column(name = "average_cost_for_two", nullable = false)
    private BigDecimal averageCostForTwo;

    @Column(nullable = false)
    private String currency;

    @Column(name = "is_open", nullable = false)
    private boolean open;

    @Column(nullable = false)
    private boolean featured;

    @Column(name = "primary_offer")
    private String primaryOffer;

    @Column(name = "is_pure_veg", nullable = false)
    private boolean pureVeg;

    protected RestaurantEntity() {
    }

    public UUID getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getName() {
        return name;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public String[] getCuisines() {
        return cuisines;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Long getAreaCode() {
        return areaCode;
    }

    public String getArea() {
        return area;
    }

    public Long getCityCode() {
        return cityCode;
    }

    public String getCity() {
        return city;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public Long getTotalRatings() {
        return totalRatings;
    }

    public Integer getMinimumDeliveryMinutes() {
        return minimumDeliveryMinutes;
    }

    public Integer getMaximumDeliveryMinutes() {
        return maximumDeliveryMinutes;
    }

    public BigDecimal getAverageCostForTwo() {
        return averageCostForTwo;
    }

    public String getCurrency() {
        return currency;
    }

    public boolean isOpen() {
        return open;
    }

    public boolean isFeatured() {
        return featured;
    }

    public String getPrimaryOffer() {
        return primaryOffer;
    }

    public boolean isPureVeg() { return pureVeg;}
}