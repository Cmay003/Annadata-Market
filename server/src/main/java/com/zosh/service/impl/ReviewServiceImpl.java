package com.zosh.service.impl;

import com.zosh.exception.ReviewNotFoundException;
import com.zosh.model.Product;
import com.zosh.model.Review;
import com.zosh.model.User;
import com.zosh.repository.ProductRepository;
import com.zosh.repository.ReviewRepository;
import com.zosh.request.CreateReviewRequest;
import com.zosh.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @Override
    public Review createReview(CreateReviewRequest req,
            User user,
            Product product) {
        Review newReview = new Review();

        newReview.setReviewText(req.getReviewText());
        newReview.setRating(req.getReviewRating());
        newReview.setProductImages(req.getProductImages());
        newReview.setUser(user);
        newReview.setProduct(product);

        product.getReviews().add(newReview);

        // ⭐ UPDATE PRODUCT RATING
        updateProductRating(product.getId());

        return reviewRepository.save(newReview);
    }

    @Override
    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findReviewsByProductId(productId);
    }

    @Override
    public Review updateReview(Long reviewId,
            String reviewText,
            double rating,
            Long userId) throws ReviewNotFoundException, AuthenticationException {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review Not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new AuthenticationException("You do not have permission to update this review");
        }

        review.setReviewText(reviewText);
        review.setRating(rating);

        updateProductRating(review.getProduct().getId());

        return reviewRepository.save(review);

    }

    // @Override
    // public void deleteReview(Long reviewId,Long userId) throws ReviewNotFoundException,
    //         AuthenticationException {
    //     Review review=reviewRepository.findById(reviewId)
    //             .orElseThrow(()-> new ReviewNotFoundException("Review Not found"));
    //     if(review.getUser().getId()!=userId){
    //         throw new AuthenticationException("You do not have permission to delete this review");
    //     }
    //     reviewRepository.delete(review);
    // }
    @Override
    public void deleteReview(Long reviewId, Long userId)
            throws ReviewNotFoundException, AuthenticationException {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review Not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new AuthenticationException("You do not have permission");
        }

        Long productId = review.getProduct().getId();

        reviewRepository.delete(review);

        // ⭐ UPDATE PRODUCT RATING
        updateProductRating(productId);
    }

    private void updateProductRating(Long productId) {

        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        int totalReviews = reviewRepository.getTotalReviewCount(productId);

        Product product = productRepository.findById(productId).orElseThrow();

        product.setAverageRating(avgRating != null ? avgRating : 0.0);
        product.setTotalReviews(totalReviews);

        productRepository.save(product);

    }

}
