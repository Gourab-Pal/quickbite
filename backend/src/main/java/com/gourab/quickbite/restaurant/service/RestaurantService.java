package com.gourab.quickbite.restaurant.service;

import com.gourab.quickbite.restaurant.dto.RestaurantSummaryResponse;
import org.springframework.stereotype.Service;
import com.gourab.quickbite.common.api.PageResponse;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
public class RestaurantService {

    public List<RestaurantSummaryResponse> getAllRestaurants() {
        return List.of(
                new RestaurantSummaryResponse(
                        UUID.fromString(
                                "9f4d4a18-8b70-4ac2-b234-01d7e54a1001"
                        ),
                        "meghana-foods-koramangala",
                        "Meghana Foods",
                        "Fiery biryanis, kebabs and comforting Andhra favourites.",
                        List.of("Biryani", "Andhra"),
                        null,
                        "Koramangala",
                        "Bengaluru",
                        new BigDecimal("4.7"),
                        12840L,
                        25,
                        30,
                        new BigDecimal("500.00"),
                        "INR",
                        true,
                        true,
                        "20% OFF"
                ),
                new RestaurantSummaryResponse(
                        UUID.fromString(
                                "9f4d4a18-8b70-4ac2-b234-01d7e54a1002"
                        ),
                        "brik-oven-indiranagar",
                        "Brik Oven",
                        "Hand-stretched sourdough pizzas from a wood-fired oven.",
                        List.of("Pizza", "Italian"),
                        null,
                        "Indiranagar",
                        "Bengaluru",
                        new BigDecimal("4.6"),
                        8450L,
                        30,
                        35,
                        new BigDecimal("700.00"),
                        "INR",
                        true,
                        true,
                        "FREE DELIVERY"
                ),
                new RestaurantSummaryResponse(
                        UUID.fromString(
                                "9f4d4a18-8b70-4ac2-b234-01d7e54a1003"
                        ),
                        "taaza-thindi-jayanagar",
                        "Taaza Thindi",
                        "Crisp dosas, soft idlis and freshly brewed filter coffee.",
                        List.of("South Indian"),
                        null,
                        "Jayanagar",
                        "Bengaluru",
                        new BigDecimal("4.8"),
                        15210L,
                        20,
                        25,
                        new BigDecimal("250.00"),
                        "INR",
                        true,
                        false,
                        "15% OFF"
                ),
                new RestaurantSummaryResponse(
                        UUID.fromString(
                                "9f4d4a18-8b70-4ac2-b234-01d7e54a1004"
                        ),
                        "green-theory-residency-road",
                        "Green Theory",
                        "Fresh bowls, salads and wholesome plant-forward meals.",
                        List.of("Healthy", "Continental"),
                        null,
                        "Residency Road",
                        "Bengaluru",
                        new BigDecimal("4.5"),
                        3260L,
                        25,
                        35,
                        new BigDecimal("600.00"),
                        "INR",
                        true,
                        false,
                        "10% OFF"
                ),
                new RestaurantSummaryResponse(
                        UUID.fromString(
                                "9f4d4a18-8b70-4ac2-b234-01d7e54a1005"
                        ),
                        "corner-house-koramangala",
                        "Corner House",
                        "Iconic sundaes, rich chocolate sauces and frozen treats.",
                        List.of("Desserts", "Ice Cream"),
                        null,
                        "Koramangala",
                        "Bengaluru",
                        new BigDecimal("4.7"),
                        9870L,
                        20,
                        30,
                        new BigDecimal("350.00"),
                        "INR",
                        true,
                        true,
                        "BUY 1 GET 1"
                ),
                new RestaurantSummaryResponse(
                        UUID.fromString(
                                "9f4d4a18-8b70-4ac2-b234-01d7e54a1006"
                        ),
                        "burma-burma-indiranagar",
                        "Burma Burma",
                        "Modern Burmese food with bold flavours and comforting bowls.",
                        List.of("Asian", "Burmese"),
                        null,
                        "Indiranagar",
                        "Bengaluru",
                        new BigDecimal("4.6"),
                        5640L,
                        35,
                        40,
                        new BigDecimal("900.00"),
                        "INR",
                        true,
                        false,
                        "₹150 OFF"
                )
        );
    }

    public PageResponse<RestaurantSummaryResponse> getRestaurants(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page number must be zero or greater"
            );
        }

        if (size < 1 || size > 100) {
            throw new IllegalArgumentException(
                    "Page size must be between 1 and 100"
            );
        }

        List<RestaurantSummaryResponse> allRestaurants =
                getAllRestaurants();

        int totalElements = allRestaurants.size();
        int totalPages = (totalElements + size - 1) / size;

        long requestedOffset = (long) page * size;

        int fromIndex = (int) Math.min(
                requestedOffset,
                totalElements
        );

        int toIndex = Math.min(
                fromIndex + size,
                totalElements
        );

        List<RestaurantSummaryResponse> pageItems =
                List.copyOf(allRestaurants.subList(fromIndex, toIndex));

        return new PageResponse<>(
                pageItems,
                page,
                size,
                totalElements,
                totalPages,
                page == 0,
                totalPages == 0 || page >= totalPages - 1
        );
    }

    public Optional<RestaurantSummaryResponse> getRestaurantById(UUID restaurantId) {
        List<RestaurantSummaryResponse> restaurants = getAllRestaurants();
        for(RestaurantSummaryResponse restaurant : restaurants) {
            if(restaurant.id().equals(restaurantId)) {
                return Optional.of(restaurant);
            }
        }
        return Optional.empty();
    }
}