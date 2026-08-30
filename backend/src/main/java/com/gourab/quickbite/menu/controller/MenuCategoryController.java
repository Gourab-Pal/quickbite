package com.gourab.quickbite.menu.controller;

import com.gourab.quickbite.menu.dto.MenuCategoryResponse;
import com.gourab.quickbite.menu.service.MenuCategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/restaurants")
public class MenuCategoryController {
    private final MenuCategoryService menuCategoryService;
    public MenuCategoryController(MenuCategoryService menuCategoryService) {
        this.menuCategoryService = menuCategoryService;
    }

    @GetMapping("/{restaurantId}/menu/categories")
    public List<MenuCategoryResponse> getMenuCategoriesByRestaurantId(@PathVariable UUID restaurantId) {
        return menuCategoryService.getMenuCategoriesByRestaurantId(restaurantId);
    }
}
