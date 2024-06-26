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
exports.location_delete_get = asyncHandler(async (req, res) => {
    // Get the location and all the modalities that starts or end in that location.
    const [location, modalitiesInLocation] = await Promise.all([
        Location.findById(req.params.id).exec(),
        Modality.find({ $or: [{ start_location: req.params.id }, { end_location: req.params.id }] }).populate('race').exec(),
    ]);

    if (location == null) {
        // No results.
        res.redirect('/catalog/locations');
    }

    res.render('location_delete', {
        title: 'Delete Location',
        location: location,
        location_modalities: modalitiesInLocation,
        layout: 'layout',
    });
});

// Handle Location delete on POST.
exports.location_delete_post = asyncHandler(async (req, res) => {
    // Get the location and all the modalities that starts or end in that location.
    const [location, modalitiesInLocation] = await Promise.all([
        Location.findById(req.body.locationid).exec(),
        Modality.find({ $or: [{ start_location: req.body.locationid }, { end_location: req.body.locationid }] }).exec(),
    ]);

    if (modalitiesInLocation.length > 0) {
        // Location has modalities. Render in same way as for GET route.
        res.render('location_delete', {
            title: 'Delete Location',
            location: location,
            location_modalities: modalitiesInLocation,
            layout: 'layout',
        });
        return;
    } else {
        // Test for auth user
        if (req.session.authenticated) {
            // Retrieve data session
            req.body = req.session.body || req.body;
            req.session.body = null; // Reset data session

            // Location has no modalities. Delete object and redirect to the list of locations.
            await Location.findByIdAndDelete(req.body.locationid).exec();
            res.redirect('/catalog/locations');
        } else {
            res.redirect(`/confirm-password?returnTo=${encodeURIComponent(req.originalUrl)}`);
        }
    }
});

// Display Location update form on GET.
exports.location_update_get = asyncHandler(async (req, res, next) => {
    // Get the location.
    const location = await Location.findById(req.params.id).exec();

    if (location == null) {
        const err = new Error('Location not found');
        err.status = 404;
        return next(err);
    }

    res.render('location_form', {
        title: 'Update Location',
        location: location,
        communities: Location.schema.path('community').enumValues,
        errors: null,
        layout: 'layout',
    });
});

// Handle Location update on POST.
exports.location_update_post = [
    // Middleware to move data from session to body
    (req, res, next) => {
        if (req.session.body) {
            req.body = req.session.body;
            req.session.body = null;
        }
        next();
    },

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
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('location_form', {
                title: 'Update Location',
                location: location,
                communities: Location.schema.path('community').enumValues,
                errors: errors.array(),
                layout: 'layout',
            });
            return;
        } else {
            // Test for authenticated user
            if (req.session.authenticated) {
                // Data from form is valid. Update the record.
                await Location.findByIdAndUpdate(req.params.id, location, {});
                res.redirect(location.url);
            } else {
                res.redirect(`/confirm-password?returnTo=${encodeURIComponent(req.originalUrl)}`);
            }
        }
    }),
];