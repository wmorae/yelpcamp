const express = require('express')
const router = express.Router();
<<<<<<< HEAD
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
=======
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const { isLoggedIn } = require('../middleware')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.datails.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("invalid campground data", 400);

    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');

    if (!campground) {
        req.flash('error', 'Cannot find that Campgroud!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });

}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that Campgroud!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}));
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}));
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
}));
>>>>>>> 30c81d8fafe91a2d550add2acfdb35985d8b1741

module.exports = router