package com.zosh.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.zosh.domain.Grade;
import com.zosh.exception.ProductException;
import com.zosh.model.Category;
import com.zosh.model.CommissionSetting;
import com.zosh.model.Product;
import com.zosh.model.Seller;
import com.zosh.repository.CategoryRepository;
import com.zosh.repository.CommissionSettingRepository;
import com.zosh.repository.ProductRepository;
import com.zosh.request.CreateProductRequest;
import com.zosh.service.ProductService;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    private final CommissionSettingRepository commissionRepository;

    @Override
    public Product createProduct(CreateProductRequest req, Seller seller) throws ProductException {

        CommissionSetting commission
                = commissionRepository
                        .findTopByOrderByCreatedAtDesc()
                        .orElse(null);

        double commissionPercent
                = commission != null
                        ? commission.getPlatformCommissionPercent()
                        : 0.0;

        double commissionAmount
                = req.getSellingPrice() * commissionPercent / 100;

        double farmerEarn
                = req.getSellingPrice() - commissionAmount;

        int discount = calculateDiscountPercentage(req.getMrpPrice(), req.getSellingPrice());

        // Category category = categoryRepository.findByCategoryId(req.getCategory());
        // if (category == null) {
        //     category = new Category();
        //     category.setCategoryId(req.getCategory());
        //     category.setName(req.getCategory());
        //     category.setLevel(1);
        //     category = categoryRepository.save(category);
        // }
        String normalizedCategory = req.getCategory().toLowerCase().trim();

        Category category = categoryRepository.findByCategoryId(normalizedCategory);

        if (category == null) {
            category = new Category();
            category.setCategoryId(normalizedCategory);   // ✅ FIX
            // category.setName(req.getCategory());          // UI ke liye original
            category.setName(req.getCategory());
            category.setLevel(1);
            category = categoryRepository.save(category);
        }

        Product product = new Product();

        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());

        product.setMrpPrice(req.getMrpPrice());
        product.setSellingPrice(req.getSellingPrice());
        product.setDiscountPercent(discount);

        product.setQuantity(req.getQuantity());

        product.setWeight(req.getWeight());
        product.setUnit(req.getUnit());

        product.setCity(req.getCity());   // ✅ ADD THIS

        // ✅ Grade
        product.setGrade(Grade.valueOf(req.getGrade()));

        product.setImages(req.getImages());

        product.setCategory(category);
        product.setSeller(seller);

        product.setCreatedAt(LocalDateTime.now());
        product.setIn_stock(true);

        product.setCommissionPercentage(commissionPercent);
        product.setFarmerEarning(farmerEarn);

        return productRepository.save(product);
    }

    public static int calculateDiscountPercentage(double mrpPrice, double sellingPrice) {
        if (mrpPrice <= 0) {
            throw new IllegalArgumentException("Actual price must be greater than zero.");
        }
        double discount = mrpPrice - sellingPrice;
        double discountPercentage = (discount / mrpPrice) * 100;
        return (int) discountPercentage;
    }

    @Override
    public void deleteProduct(Long productId) throws ProductException {
        Product product = findProductById(productId);
        productRepository.delete(product);

    }

    // @Override
    // public Product updateProduct(Long productId, Product product) throws ProductException {
    //     productRepository.findById(productId);
    //     product.setId(productId);
    //     return productRepository.save(product);
    // }
    @Override
    public Product updateProduct(Long productId, CreateProductRequest req) throws ProductException {

        CommissionSetting commission
                = commissionRepository
                        .findTopByOrderByCreatedAtDesc()
                        .orElse(null);

        double commissionPercent
                = commission != null
                        ? commission.getPlatformCommissionPercent()
                        : 0.0;

        Product product = findProductById(productId);

        double commissionAmount
                = product.getSellingPrice()
                * commissionPercent
                / 100;

        double farmerEarn
                = product.getSellingPrice()
                - commissionAmount;

        // ✅ Safe update (no null issue)
        if (req.getTitle() != null) {
            product.setTitle(req.getTitle());
        }

        if (req.getDescription() != null) {
            product.setDescription(req.getDescription());
        }

        if (req.getMrpPrice() != 0) {
            product.setMrpPrice(req.getMrpPrice());
        }

        if (req.getSellingPrice() != 0) {
            product.setSellingPrice(req.getSellingPrice());
        }

        // ✅ Discount auto calculate
        if (req.getMrpPrice() != 0 && req.getSellingPrice() != 0) {
            product.setDiscountPercent(
                    calculateDiscountPercentage(req.getMrpPrice(), req.getSellingPrice())
            );
        }

        if (req.getQuantity() != 0) {
            product.setQuantity(req.getQuantity());
        }

        if (req.getWeight() != 0) {
            product.setWeight(req.getWeight());
        }

        if (req.getUnit() != null) {
            product.setUnit(req.getUnit());
        }

        if (req.getGrade() != null) {
            product.setGrade(Grade.valueOf(req.getGrade()));
        }

        if (req.getImages() != null) {
            product.setImages(req.getImages());
        }

        // ✅ Category handling
        if (req.getCategory() != null) {
            Category category = categoryRepository.findByCategoryId(req.getCategory());

            if (category == null) {
                category = new Category();
                category.setCategoryId(req.getCategory());
                category.setName(req.getCategory());
                category.setLevel(1);
                category = categoryRepository.save(category);
            }

            product.setCategory(category);
        }

        product.setCommissionPercentage(commissionPercent);
        product.setFarmerEarning(farmerEarn);

        return productRepository.save(product);
    }

    @Override
    public Product updateProductStock(Long productId) throws ProductException {
        Product product = this.findProductById(productId);
        product.setIn_stock(!product.isIn_stock());
        return productRepository.save(product);
    }

    @Override
    public Product findProductById(Long id) throws ProductException {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductException("product not found"));
    }

    @Override
    public List<Product> searchProduct(String query) {
        return productRepository.searchProduct(query);
    }

    // @Override
    // public Page<Product> getAllProduct(String category,
    //         String brand,
    //         String color,
    //         String size,
    //         Integer minPrice,
    //         Integer maxPrice,
    //         Integer minDiscount,
    //         String sort,
    //         String stock,
    //         Integer pageNumber) {
    //     Specification<Product> spec = (root, query, criteriaBuilder) -> {
    //         List<Predicate> predicates = new ArrayList<>();
    //         // if (category != null && !category.isEmpty()) {
    //         //     Join<Product, Category> categoryJoin = root.join("category");
    //         //     Predicate categoryPredicate = criteriaBuilder.or(
    //         //             // ✅ FIXED (case insensitive)
    //         //             criteriaBuilder.equal(
    //         //                     criteriaBuilder.lower(categoryJoin.get("categoryId")),
    //         //                     category.toLowerCase()
    //         //             ),
    //         //             criteriaBuilder.equal(
    //         //                     criteriaBuilder.lower(categoryJoin.get("parentCategory").get("categoryId")),
    //         //                     category.toLowerCase()
    //         //             )
    //         //     );
    //         //     predicates.add(categoryPredicate);
    //         // }
    //         if (category != null && !category.isEmpty()) {
    //             Join<Product, Category> categoryJoin = root.join("category");
    //             predicates.add(
    //                     criteriaBuilder.equal(
    //                             criteriaBuilder.lower(categoryJoin.get("categoryId")),
    //                             category.toLowerCase().trim()
    //                     )
    //             );
    //         }
    //         if (color != null && !color.isEmpty()) {
    //             System.out.println("color " + color);
    //             System.out.println("CATEGORY RECEIVED = " + category);
    //             predicates.add(criteriaBuilder.equal(root.get("color"), color));
    //         }
    //         // Filter by size (single value)
    //         if (size != null && !size.isEmpty()) {
    //             predicates.add(criteriaBuilder.equal(root.get("size"), size));
    //         }
    //         if (minPrice != null) {
    //             predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sellingPrice"),
    //                     minPrice));
    //         }
    //         if (maxPrice != null) {
    //             predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("sellingPrice"),
    //                     maxPrice));
    //         }
    //         if (minDiscount != null) {
    //             predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("discountPercent"),
    //                     minDiscount));
    //         }
    //         if (stock != null) {
    //             predicates.add(criteriaBuilder.equal(root.get("stock"), stock));
    //         }
    //         return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    //     };
    //     Pageable pageable;
    //     if (sort != null && !sort.isEmpty()) {
    //         pageable = switch (sort) {
    //             case "price_low" ->
    //                 PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").ascending());
    //             case "price_high" ->
    //                 PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").descending());
    //             default ->
    //                 PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.unsorted());
    //         };
    //     } else {
    //         pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.unsorted());
    //     }
    //     return productRepository.findAll(spec, pageable);
    // }
    @Override
    public Page<Product> getAllProduct(
            String category,
            String brand,
            String city,
            String grade,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber
    ) {

        Specification<Product> spec = (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // ✅ CATEGORY
            if (category != null && !category.isEmpty()) {
                Join<Product, Category> categoryJoin = root.join("category");

                predicates.add(
                        cb.equal(
                                cb.lower(categoryJoin.get("categoryId")),
                                category.toLowerCase().trim()
                        )
                );
            }

            // ✅ CITY (F2C IMPORTANT)
            if (city != null && !city.isEmpty()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("city")),
                                "%" + city.toLowerCase().trim() + "%"
                        )
                );
            }

            // ✅ GRADE (VERY IMPORTANT)
            if (grade != null && !grade.isEmpty()) {
                try {
                    predicates.add(
                            cb.equal(
                                    root.get("grade"),
                                    Grade.valueOf(grade.toUpperCase())
                            )
                    );
                } catch (Exception e) {
                    throw new RuntimeException("Invalid grade");
                }
            }

            // ✅ PRICE FILTER
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            }

            // ✅ DISCOUNT
            if (minDiscount != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("discountPercent"), minDiscount));
            }

            // ✅ STOCK FIXED
            if (stock != null) {
                predicates.add(
                        cb.equal(root.get("in_stock"), Boolean.parseBoolean(stock))
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable;

        if (sort != null && !sort.isEmpty()) {
            pageable = switch (sort) {
                case "price_low" ->
                    PageRequest.of(pageNumber != null ? pageNumber : 0, 10,
                    Sort.by("sellingPrice").ascending());

                case "price_high" ->
                    PageRequest.of(pageNumber != null ? pageNumber : 0, 10,
                    Sort.by("sellingPrice").descending());

                default ->
                    PageRequest.of(pageNumber != null ? pageNumber : 0, 10);
            };
        } else {
            pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, 10);
        }

        return productRepository.findAll(spec, pageable);
    }

    @Override
    public List<Product> recentlyAddedProduct() {
        return List.of();
    }

    @Override
    public List<Product> getProductBySellerId(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }
}
