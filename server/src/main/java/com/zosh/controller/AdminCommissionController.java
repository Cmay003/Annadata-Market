// package com.zosh.controller;

// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.zosh.model.CommissionSetting;
// import com.zosh.repository.CommissionSettingRepository;

// import lombok.RequiredArgsConstructor;



// @RestController
// @RequestMapping("/admin/commission/save")
// @RequiredArgsConstructor
// public class AdminCommissionController {

//     private final CommissionSettingRepository repository;

//     @GetMapping
//     public CommissionSetting get() {
//         return repository.findAll().get(0);
//     }

//     @PutMapping
//     public CommissionSetting save(@RequestBody CommissionSetting setting) {
//         return repository.save(setting);
//     }
// }

package com.zosh.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.model.CommissionSetting;
import com.zosh.model.Product;
import com.zosh.repository.CommissionSettingRepository;
import com.zosh.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/commission/save")
@RequiredArgsConstructor
public class AdminCommissionController {

    private final CommissionSettingRepository repository;
    private final ProductRepository productRepository;

    @GetMapping
    public CommissionSetting getSettings() {

        return repository
                .findTopByOrderByCreatedAtDesc()
                .orElseGet(() -> {

                    CommissionSetting setting =
                            new CommissionSetting();

                    return repository.save(setting);
                });
    }


    // @PutMapping
    // public CommissionSetting updateSettings(
    //         @RequestBody CommissionSetting setting
    // ) {

    //     return repository.save(setting);
    // }


    @PutMapping
public CommissionSetting updateSettings(
        @RequestBody CommissionSetting setting
) {

    CommissionSetting savedSetting =
            repository.save(setting);

    Double commissionPercent =
            savedSetting.getPlatformCommissionPercent();

    List<Product> products =
            productRepository.findAll();

    for (Product product : products) {

        double commissionAmount =
                product.getSellingPrice()
                        * commissionPercent
                        / 100;

        double farmerEarn =
                product.getSellingPrice()
                        - commissionAmount;

        product.setCommissionPercentage(
                commissionPercent
        );

        product.setFarmerEarning(
                farmerEarn
        );
    }

    productRepository.saveAll(products);

    return savedSetting;
}
}