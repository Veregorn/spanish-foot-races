const Category = require('../models/category');
const Race = require('../models/race');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
    res.render('category_form', {
        title: 'Create Category',
        category: null,
        errors: null,
        layout: 'layout',
    });
};

// Handle Category create on POST.
exports.category_create_post = [
    // Validate and sanitize fields.
    body('name', 'Category name required')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body('description', 'Description (optional)')
        .trim()
        .isLength({ max: 1000 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Category object with escaped and trimmed data.
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('category_form', {
                title: 'Create Category',
                category: category,
                errors: errors.array(),
                layout: 'layout',
            });
            return;
        }

        try {
            // Check if Category with same name already exists.
            const existingCategory = await Category.findOne({ name: req.body.name })
                .collation({ locale: 'en', strength: 2 }) // Case-insensitive search
                .exec();
            if (existingCategory) {
                // Redirect to the existing Category's detail page.
                res.redirect(existingCategory.url);
            } else {
                // Save the new Category.
                await category.save();
                res.redirect(category.url);
            }
        } catch (err) {
            return next(err);
        }
    }),
];

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