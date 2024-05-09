const Category = require('../models/category');
const Race = require('../models/race');
const asyncHandler = require('express-async-handler');

// Display list of all Category.
exports.category_list = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().sort({ name: 1 }).exec();
    res.render('category_list', {
        title: 'Category List',
        category_list: categories,
        layout: 'layout',
    });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
    // Get details for the requested category and all the races in the category (in parallel).
    const [category, racesInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Race.find({ category: req.params.id }).exec(),
    ]);

    if (category == null) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }

    res.render('category_detail', {
        title: 'Category Detail',
        category: category,
        category_races: racesInCategory,
        layout: 'layout',
    });
});

// Display Category create form on GET.
exports.category_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category create GET');
};

// Handle Category create on POST.
exports.category_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category create POST');
};

// Display Category delete form on GET.
exports.category_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete GET');
};

// Handle Category delete on POST.
exports.category_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete POST');
};

// Display Category update form on GET.
exports.category_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update GET');
};

// Handle Category update on POST.
exports.category_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update POST');
};