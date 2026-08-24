package com.gourab.quickbite.restaurant.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record RestaurantSummaryResponse(
        UUID id,
        String slug,
        String name,
        String shortDescription,
        List<String> cuisines,
        String imageUrl,
        String area,
        String city,
        BigDecimal averageRating,
        Long totalRatings,
        Integer minimumDeliveryMinutes,
        Integer maximumDeliveryMinutes,
        BigDecimal averageCostForTwo,
        String currency,
        boolean open,
        boolean featured,
        String primaryOffer
) {
}
