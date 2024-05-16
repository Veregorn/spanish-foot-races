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
exports.category_delete_get = asyncHandler(async (req, res) => {
    // Get details of the requested category and all the races in the category.
    const [category, racesInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Race.find({ category: req.params.id }).exec(),
    ]);

    if (category == null) {
        // No results.
        res.redirect('/catalog/categories');
    }

    res.render('category_delete', {
        title: 'Delete Category',
        category: category,
        category_races: racesInCategory,
        layout: 'layout',
    });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res) => {
    // Get details of the requested category and all the races in the category.
    const [category, racesInCategory] = await Promise.all([
        Category.findById(req.body.categoryid).exec(),
        Race.find({ category: req.body.categoryid }).exec(),
    ]);

    if (racesInCategory.length > 0) {
        // Category has races. Render the form again with sanitized values/error messages.
        res.render('category_delete', {
            title: 'Delete Category',
            category: category,
            category_races: racesInCategory,
            layout: 'layout',
        });
        return;
    } else {
        // Category has no races. Delete the category and redirect to the list of categories.
        await Category.findByIdAndDelete(req.body.categoryid).exec();
        res.redirect('/catalog/categories');
    }
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
    // Get the category.
    const category = await Category.findById(req.params.id).exec();

    if (category == null) {
        // No results.
        res.redirect('/catalog/categories');
    }

    res.render('category_form', {
        title: 'Update Category',
        category: category,
        errors: null,
        layout: 'layout',
    });
});

// Handle Category update on POST.
exports.category_update_post = [
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
            _id: req.params.id, // This is required, or a new ID will be assigned!

        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('category_form', {
                title: 'Update Category',
                category: category,
                errors: errors.array(),
                layout: 'layout',
            });
            return;
        } else {
            // Data from form is valid. Update the Category.
            await Category.findByIdAndUpdate(req.params.id, category, {});
            res.redirect(category.url);
        }
    }),
];