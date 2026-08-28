package com.gourab.quickbite.restaurant.controller;

import com.gourab.quickbite.common.api.PageResponse;
import com.gourab.quickbite.restaurant.dto.RestaurantSummaryResponse;
import com.gourab.quickbite.restaurant.service.RestaurantService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    public PageResponse<RestaurantSummaryResponse> getRestaurants(
            @RequestParam(required = false)
            Long cityCode,

            @RequestParam(required = false)
            Boolean open,

            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "Page number must be zero or greater")
            int page,

            @RequestParam(defaultValue = "20")
            @Min(value = 1, message = "Page size must be at least 1")
            @Max(value = 100, message = "Page size must not exceed 100")
            int size
    ) {
        if(open != null) {
            return restaurantService.getRestaurantsByOpenStatus(open, page, size);
        }
        if(cityCode != null) {
            return restaurantService.getRestaurantsByCityCode(cityCode, page, size);
        }

        return restaurantService.getRestaurants(page, size);
    }

    @GetMapping("/{restaurantId}")
    public ResponseEntity<RestaurantSummaryResponse> getRestaurantById(@PathVariable UUID restaurantId) {
        Optional<RestaurantSummaryResponse> restaurant = restaurantService.getRestaurantById(restaurantId);
        if(restaurant.isPresent()) {
            return ResponseEntity.ok(restaurant.get());
        }
        return ResponseEntity.notFound().build();
    }
}
