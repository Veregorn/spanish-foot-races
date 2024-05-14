const Location = require('../models/location');
const Modality = require('../models/modality');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all Locations.
exports.location_list = asyncHandler(async (req, res, next) => {
    const locations = await Location.find().sort({ city: 1 }).exec();
    res.render('location_list', {
        title: 'Location List',
        location_list: locations,
        layout: 'layout',
    });
});

// Display detail page for a specific Location.
exports.location_detail = asyncHandler(async (req, res, next) => {
    // Get details for the requested location and all the modalities that starts or end in that location.
    const [location, modalitiesInLocation] = await Promise.all([
        Location.findById(req.params.id).exec(),
        Modality.find({ $or: [{ start_location: req.params.id }, { end_location: req.params.id }] })
            .populate('race')
            .exec(),
    ]);

    if (location == null) {
        const err = new Error('Location not found');
        err.status = 404;
        return next(err);
    }

    res.render('location_detail', {
        title: 'Location Detail',
        location: location,
        location_modalities: modalitiesInLocation,
        layout: 'layout',
    });
});

// Display Location create form on GET.
exports.location_create_get = function(req, res) {
    res.render('location_form', {
        title: 'Create Location',
        location: null,
        communities: Location.schema.path('community').enumValues,
        errors: null,
        layout: 'layout',
    });
};

// Handle Location create on POST.
exports.location_create_post = [
    // Validate and sanitize fields.
    body('city', 'City name required')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body('community')
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Location object with escaped and trimmed data.
        const location = new Location({
            city: req.body.city,
            community: req.body.community,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('location_form', {
                title: 'Create Location',
                location: location,
                communities: Location.schema.path('community').enumValues,
                errors: errors.array(),
                layout: 'layout',
            });
            return;
        }

        try {
            // Check if Location with same name already exists.
            const foundLocation = await Location.findOne({ city: req.body.city })
                .collation({ locale: 'en', strength: 2 }) // Case-insensitive search
                .exec();
            if (foundLocation) {
                res.redirect(foundLocation.url);
            } else {
                // Save the new Location.
                await location.save();
                res.redirect(location.url);
            }
        } catch (err) {
            return next(err);
        }
    }),
];

// Display Location delete form on GET.
exports.location_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Location delete GET');
};

// Handle Location delete on POST.
exports.location_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Location delete POST');
};

// Display Location update form on GET.
exports.location_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Location update GET');
};

// Handle Location update on POST.
exports.location_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Location update POST');
};