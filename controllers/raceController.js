const Race = require('../models/race');
const Modality = require('../models/modality');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configuring cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Function to decode the image URL
function decodeImageURL(imageURL) {
    const entities = {
        '&#x2F;': '/',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    };
    return imageURL.replace(/&#x2F;|&amp;|&lt;|&gt;|&quot;|&#39;/g, function (match) {
        return entities[match];
    });
};

// Display list of all races.
exports.race_list = asyncHandler(async (req, res, next) => {
    const races = await Race.find({}, 'name category')
        .sort({ name: 1})
        .populate('category')
        .exec();

    res.render('race_list', {
        title: 'Race list',
        race_list: races,
        layout: 'layout'
    });
});

// Display detail page for a specific Race.
exports.race_detail = asyncHandler(async (req, res, next) => {
    // Get details for the requested race, including the category and all the modalities that belongs to that race.
    const [ race, modalitiesInRace ] = await Promise.all([
        Race.findById(req.params.id)
            .populate('category')
            .exec(),
        Modality.find({race: req.params.id}).exec()
    ]);

    if (race == null) {
        const err = new Error('Race not found');
        err.status = 404;
        return next(err);
    }

    res.render('race_detail', {
        title: 'Race Detail',
        race: race,
        race_modalities: modalitiesInRace,
        layout: 'layout'
    });
});

// Display Race create form on GET.
exports.race_create_get = asyncHandler(async (req, res) => {
    // Get all the categories, which we can use for adding to our race
    const categories = await Category.find().sort({ name: 1 }).exec();

    res.render('race_form', {
        title: 'Create race',
        race: null,
        categories: categories,
        errors: null,
        layout: 'layout',
    });
});

// Display Race create form on POST.
exports.race_create_post = [
    // Validate and sanitize fields.
    body('name', 'Race name required')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),
    body('category', 'Category required')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body('description', 'Description (optional)')
        .trim()
        .isLength({ max: 1000 })
        .escape(),
    body('image_url', 'Image URL (optional)')
        .trim()
        .isLength({ max: 1000 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a race object with escaped and trimmed data.
        const race = new Race({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            image_url: req.body.image_url || '',
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.

            // Get all categories for form.
            const categories = Category.find().sort({ name: 1 }).exec();
            
            res.render('race_form', {
                title: 'Create Race',
                race: race,
                categories: categories,
                errors: errors.array(),
                layout: 'layout',
            });
            return;
        }

        try {
            // Check if Race with same name already exists.
            const existingRace = await Race.findOne({ name: req.body.name })
                .collation({ locale: 'en', strength: 2 }) // Case-insensitive search
                .exec();
            if (existingRace) {
                res.redirect(existingRace.url);
            } else {
                // Before saving we need to upload the image to the cloud storage and get the URL.
                if (req.body.image_url !== '') {
                    // First we need to decode the image URL.
                    req.body.image_url = decodeImageURL(req.body.image_url);
                    await cloudinary.uploader.upload(req.body.image_url, {tags: "logo"}, (err, result) => {
                        if (err) console.log(err);
                    });

                    race.image_url = await cloudinary.url(req.body.image_url);
                }
                // Save the new Race.
                await race.save();
                res.redirect(race.url);
            }
        } catch (err) {
            return next(err);
        }
    }),
];

// Display Race delete form on GET.
exports.race_delete_get = asyncHandler(async (req, res) => {
    console.log('Deleting the race with id (GET): ' + req.params.id);
    // Get details of the requested race and all the modalities that belongs to that race.
    const [race, modalitiesInRace] = await Promise.all([
        Race.findById(req.params.id).exec(),
        Modality.find({ race: req.params.id }).exec(),
    ]);

    if (race == null) {
        // No results.
        res.redirect('/catalog/races');
    }

    res.render('race_delete', {
        title: 'Delete Race',
        race: race,
        race_modalities: modalitiesInRace,
        layout: 'layout',
    });
});

// Display Race delete form on POST.
exports.race_delete_post = asyncHandler(async (req, res) => {
    console.log('Deleting the race with id (POST): ' + req.body.raceid);
    // Get details of the requested race and all the modalities that belongs to that race.
    const [race, modalitiesInRace] = await Promise.all([
        Race.findById(req.body.raceid).exec(),
        Modality.find({ race: req.body.raceid }).exec(),
    ]);

    if (race != null) {
        console.log('There is one race with the id: ' + req.body.raceid);
    } else {
        console.log('There are no races with the id: ' + req.body.raceid);
    }

    if (modalitiesInRace.length > 0) {
        // Race has modalities. Render the form again with sanitized values/error messages.
        res.render('race_delete', {
            title: 'Delete Race',
            race: race,
            race_modalities: modalitiesInRace,
            layout: 'layout',
        });
        return;
    } else {
        // Race has no modalities. Delete the race and redirect to the list of races.
        await Race.findByIdAndDelete(req.body.raceid).exec();
        res.redirect('/catalog/races');
    }
});

// Display Race update form on GET.
exports.race_update_get = asyncHandler(async (req, res, next) => {
    // Get the race.
    const race = await Race.findById(req.params.id).exec();
    const categories = await Category.find().sort({ name: 1 }).exec();

    if (race == null) {
        // No results.
        const err = new Error('Race not found');
        err.status = 404;
        return next(err);
    }

    res.render('race_form', {
        title: 'Update Race',
        race: race,
        categories: categories,
        errors: null,
        layout: 'layout',
    });
});

// Display Race update form on POST.
exports.race_update_post = [
    // Validate and sanitize fields.
    body('name', 'Race name required')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),
    body('category', 'Category required')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body('description', 'Description (optional)')
        .trim()
        .isLength({ max: 1000 })
        .escape(),
    body('image_url', 'Image URL (optional)')
        .trim()
        .isLength({ max: 1000 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Race object with escaped and trimmed data.
        const race = new Race({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            image_url: req.body.image_url,
            _id: req.params.id, // This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.

            // Get all categories for form.
            const categories = Category.find().sort({ name: 1 }).exec();

            res.render('race_form', {
                title: 'Update Race',
                race: race,
                categories: categories,
                errors: errors.array(),
                layout: 'layout',
            });
            return;
        } else {
            // Before saving we need to upload the image to the cloud storage and get the URL.
            if (req.body.image_url !== '') {
                // First we need to decode the image URL.
                req.body.image_url = decodeImageURL(req.body.image_url);
                await cloudinary.uploader.upload(req.body.image_url, {tags: "logo"}, (err, result) => {
                    if (err) console.log(err);
                });

                race.image_url = await cloudinary.url(req.body.image_url);
            }
            // Data from form is valid. Update the Race.
            await Race.findByIdAndUpdate(req.params.id, race, {});
            res.redirect(race.url);
        }
    }),
];