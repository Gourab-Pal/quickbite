package com.gourab.quickbite.menu.service;

import com.gourab.quickbite.menu.dto.MenuCategoryResponse;
import com.gourab.quickbite.menu.entity.MenuCategoryEntity;
import com.gourab.quickbite.menu.repository.MenuCategoryRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class MenuCategoryService {
    private final MenuCategoryRepository menuCategoryRepository;
    public MenuCategoryService(MenuCategoryRepository menuCategoryRepository) {
        this.menuCategoryRepository = menuCategoryRepository;
    }

    public List<MenuCategoryResponse> getMenuCategoriesByRestaurantId(UUID restaurantId) {
        List<MenuCategoryEntity> databaseResult = menuCategoryRepository.findActiveCategoriesByRestaurantId(restaurantId);
        List<MenuCategoryResponse> response = new ArrayList<>();
        for(MenuCategoryEntity category : databaseResult) {
            response.add(new MenuCategoryResponse(category.getMenuCategoryName()));
        }
        return response;
    }
}
