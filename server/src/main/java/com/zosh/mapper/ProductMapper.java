package com.zosh.mapper;

import com.zosh.domain.Grade;
import com.zosh.dto.ProductDto;
import com.zosh.model.Product;

public class ProductMapper {

    // ✅ ENTITY → DTO
    public static ProductDto toProductDto(Product product) {

        ProductDto dto = new ProductDto();

        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());

        dto.setMrpPrice(product.getMrpPrice());
        dto.setSellingPrice(product.getSellingPrice());
        dto.setDiscountPercent(product.getDiscountPercent());

        dto.setQuantity(product.getQuantity());

        // ✅ F2C Fields
        dto.setWeight(product.getWeight());
        dto.setUnit(product.getUnit());

        if (product.getGrade() != null) {
            dto.setGrade(product.getGrade().name());
        }

        dto.setImages(product.getImages());
        dto.setCreatedAt(product.getCreatedAt());

        return dto;
    }

    // ✅ DTO → ENTITY
    public static Product toEntity(ProductDto dto) {

        Product product = new Product();

        product.setId(dto.getId());
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());

        product.setMrpPrice(dto.getMrpPrice());
        product.setSellingPrice(dto.getSellingPrice());
        product.setDiscountPercent(dto.getDiscountPercent());

        product.setQuantity(dto.getQuantity());

        // ✅ F2C Fields
        product.setWeight(dto.getWeight());
        product.setUnit(dto.getUnit());

        if (dto.getGrade() != null) {
            product.setGrade(Grade.valueOf(dto.getGrade()));
        }

        product.setImages(dto.getImages());
        product.setCreatedAt(dto.getCreatedAt());


        return product;
    }
}