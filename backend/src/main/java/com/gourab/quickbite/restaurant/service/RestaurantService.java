package com.gourab.quickbite.restaurant.service;

import com.gourab.quickbite.common.api.PageResponse;
import com.gourab.quickbite.restaurant.dto.RestaurantSummaryResponse;
import com.gourab.quickbite.restaurant.entity.RestaurantEntity;
import com.gourab.quickbite.restaurant.repository.RestaurantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public Optional<RestaurantSummaryResponse> getRestaurantById(UUID restaurantId) {
        Optional<RestaurantEntity> databaseResult = restaurantRepository.findById(restaurantId);

        if (databaseResult.isEmpty()) {
            return Optional.empty();
        }

        RestaurantSummaryResponse response = toResponse(databaseResult.get());

        return Optional.of(response);
    }

    public PageResponse<RestaurantSummaryResponse> getRestaurantsWithFilters(
            Boolean open,
            Boolean pureVeg,
            Long cityCode,
            BigDecimal minimumRating,
            Integer maximumDeliveryMinutes,
            int page,
            int size
    ) {
        validatePagination(page, size);
        PageRequest pageRequest = createPageRequest(page, size);
        Page<RestaurantEntity> databasePage = restaurantRepository.findWithFilters(open, pureVeg, cityCode, minimumRating, maximumDeliveryMinutes, pageRequest);
        return toPageResponse(databasePage);
    }




    ///////////////////////  PRIVATE HELPER METHODS /////////////////////////////////

    private RestaurantSummaryResponse toResponse(RestaurantEntity entity) {
        return new RestaurantSummaryResponse(
                entity.getId(),
                entity.getSlug(),
                entity.getName(),
                entity.getShortDescription(),
                Arrays.asList(entity.getCuisines()),
                entity.getImageUrl(),
                entity.getArea(),
                entity.getAreaCode(),
                entity.getCity(),
                entity.getCityCode(),
                entity.getAverageRating(),
                entity.getTotalRatings(),
                entity.getMinimumDeliveryMinutes(),
                entity.getMaximumDeliveryMinutes(),
                entity.getAverageCostForTwo(),
                entity.getCurrency(),
                entity.isOpen(),
                entity.isFeatured(),
                entity.getPrimaryOffer(),
                entity.isPureVeg()
        );
    }

    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Page number must be zero or greater");
        }

        if (size < 1 || size > 100) {
            throw new IllegalArgumentException("Page size must be between 1 and 100");
        }
    }

    private PageRequest createPageRequest(int page, int size) {
        return PageRequest.of(page, size, Sort.by("name").ascending());
    }

    private PageResponse<RestaurantSummaryResponse> toPageResponse(Page<RestaurantEntity> databasePage) {
        List<RestaurantSummaryResponse> responses = new ArrayList<>();

        for (RestaurantEntity entity : databasePage.getContent()) {
            responses.add(toResponse(entity));
        }

        return new PageResponse<>(
                responses,
                databasePage.getNumber(),
                databasePage.getSize(),
                databasePage.getTotalElements(),
                databasePage.getTotalPages(),
                databasePage.isFirst(),
                databasePage.isLast()
        );
    }


}