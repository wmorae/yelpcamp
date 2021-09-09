const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

const create = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 5
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}
const read = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('author');

    if (!campground) {
        req.flash('error', 'Cannot find that Campgroud!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });

}

const update = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}

const destroy = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
}

const editForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that Campgroud!')
        return res.redirect('/campgrounds')
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't own the post!")
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    res.render('campgrounds/edit', { campground });
}

const newForm = (req, res) => {
    res.render('campgrounds/new')
};

module.exports = {
    create,
    read,
    update,
    destroy,
    index,
    newForm,
    editForm
}