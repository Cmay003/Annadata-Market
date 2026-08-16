package com.zosh.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ProductDto {

    // private Long id;

    // private String title;

    // private String description;

    // private int mrpPrice;

    // private int sellingPrice;

    // private int discountPercent;

    // private int quantity;

    // private String color;

    // private List<String> images = new ArrayList<>();

    // private int numRatings;

    // private LocalDateTime createdAt;

    // private String Sizes;


    private Long id;

    private String title;
    private String description;

    private int mrpPrice;
    private int sellingPrice;
    private int discountPercent;

    private int quantity;

    // ✅ NEW F2C FIELDS
    private double weight;
    private String unit;
    private String grade;

    private List<String> images = new ArrayList<>();

    private LocalDateTime createdAt;

    // private boolean in_stock;

    private int numRatings;
}
