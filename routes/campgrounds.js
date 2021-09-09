const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isCampgroundAuthor, validateCampground } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.create))

router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(catchAsync(campgrounds.read))
    .put(isLoggedIn, isCampgroundAuthor, validateCampground, catchAsync(campgrounds.update))
    .delete(isLoggedIn, isCampgroundAuthor, catchAsync(campgrounds.destroy))


router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, catchAsync(campgrounds.editForm));

module.exports = router