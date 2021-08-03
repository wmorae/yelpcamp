const express = require('express')
const router = express.Router({ mergeParams: true });
<<<<<<< HEAD
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync')


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.create))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.destroy))

module.exports = router;
=======

const Campground = require('../models/campground');
const Review = require('../models/review')

const { reviewSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError')

const catchAsync = require('../utils/catchAsync')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.datails.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created a new Reviews!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router
>>>>>>> 30c81d8fafe91a2d550add2acfdb35985d8b1741
