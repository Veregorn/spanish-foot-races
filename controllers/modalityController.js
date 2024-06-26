const Modality = require('../models/modality');
const asyncHandler = require('express-async-handler');
const Instance = require('../models/instance');
const Race = require('../models/race');
const Location = require('../models/location');
const { body, validationResult } = require('express-validator');

// Display list of all Modalities.
exports.modality_list = asyncHandler(async (req, res, next) => {
    const modalities = await Modality.find({}, 'race distance')
        .sort({ race: 1, distance: 1})
        .populate('race')
        .exec();

    res.render('modality_list', {
        title: 'Modality List',
        modality_list: modalities,
        layout: 'layout'
    });
});

// Display detail page for a specific Modality.
exports.modality_detail = asyncHandler(async (req, res, next) => {
    // Get details for the requested modality, including the race name and location. Instances in future dates are also included.
    const [ modality, futureInstances ] = await Promise.all([
        Modality.findById(req.params.id)
            .populate('race')
            .populate('start_location')
            .populate('end_location')
            .exec(),
        Instance.find({modality: req.params.id, date: {$gte: Date.now()}})
            .sort({ date: 1 })
            .exec()
    ]);

    if (modality == null) {
        const err = new Error('Modality not found');
        err.status = 404;
        return next(err);
    }

    res.render('modality_detail', {
        title: 'Modality Detail',
        modality: modality,
        future_instances: futureInstances,
        layout: 'layout'
    });
});

// Display Modality create form on GET.
exports.modality_create_get = asyncHandler (async (req, res) => {
    // Get all the races available to choose from and the locations.
    const [ races, locations ] = await Promise.all([
        Race.find().sort({ name: 1 }).exec(),
        Location.find().sort({ city: 1 }).exec(),
    ]);

    res.render('modality_form', {
        title: 'Create Modality',
        modality: null,
        races: races,
        locations: locations,
        errors: null,
        layout: 'layout',
    });
});

// Handle Modality create on POST.
exports.modality_create_post = [
    // Validate and sanitize fields.
    body('race', 'Race required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('distance', 'Distance required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('start_location', 'Start location required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('end_location', 'End location required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('elevation', 'Elevation required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('track', 'Track code required')
        .trim()
        .isLength({ min: 1, max: 10000 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Modality object with escaped and trimmed data.
        const modality = new Modality({
            race: req.body.race,
            distance: req.body.distance,
            start_location: req.body.start_location,
            end_location: req.body.end_location,
            elevation: req.body.elevation,
            track: req.body.track,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.

            // Get all the races and locations available to choose from.
            const [ races, locations ] = await Promise.all([
                Race.find().sort({ name: 1 }).exec(),
                Location.find().sort({ city: 1 }).exec(),
            ]);

            res.render('modality_form', {
                title: 'Create Modality',
                modality: modality,
                races: races,
                locations: locations,
                errors: errors.array(),
                layout: 'layout',
            });
            return;
        }

        try {
            // Check if the modality already exists.
            const foundModality = await Modality.findOne({ race: req.body.race, distance: req.body.distance })
                .collation({ locale: 'en', strength: 2 })
                .exec();
            if (foundModality) {
                res.redirect(foundModality.url);
            } else {
                // Save the new Modality.
                await modality.save();
                res.redirect(modality.url);
            }
        } catch (error) {
            return next(error);
        }
    }),
];

// Display Modality delete form on GET.
exports.modality_delete_get = asyncHandler(async (req, res) => {
    // Get the modality and all the instances that use it.
    const [ modality, instances ] = await Promise.all([
        Modality.findById(req.params.id).populate('race').exec(),
        Instance.find({ modality: req.params.id }).exec(),
    ]);

    if (modality == null) {
        // No results.
        res.redirect('/catalog/modalities');
    }

    res.render('modality_delete', {
        title: 'Delete Modality',
        modality: modality,
        instances: instances,
        layout: 'layout',
    });
});

// Handle Modality delete on POST.
exports.modality_delete_post = asyncHandler(async (req, res) => {
    // Get the modality and all the instances that use it.
    const [ modality, instances ] = await Promise.all([
        Modality.findById(req.body.modalityid).exec(),
        Instance.find({ modality: req.body.modalityid }).exec(),
    ]);

    if (instances.length > 0) {
        // Modality has instances. Render in the same way as for GET route.
        res.render('modality_delete', {
            title: 'Delete Modality',
            modality: modality,
            instances: instances,
            layout: 'layout',
        });
        return;
    } else {
        // Modality has no instances. Delete object and redirect to the list of modalities.
        await Modality.findByIdAndDelete(req.body.modalityid).exec();
        res.redirect('/catalog/modalities');
    }
});

// Display Modality update form on GET.
exports.modality_update_get = asyncHandler(async (req, res, next) => {
    // Get the modality and all the races and locations available to choose from.
    const [ modality, races, locations ] = await Promise.all([
        Modality.findById(req.params.id).exec(),
        Race.find().sort({ name: 1 }).exec(),
        Location.find().sort({ city: 1 }).exec(),
    ]);

    if (modality == null) {
        // No results.
        const err = new Error('Modality not found');
        err.status = 404;
        return next(err);
    }

    res.render('modality_form', {
        title: 'Update Modality',
        modality: modality,
        races: races,
        locations: locations,
        errors: null,
        layout: 'layout',
    });
});

// Handle Modality update on POST.
exports.modality_update_post = [
    // Validate and sanitize fields
    body('race', 'Race required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('distance', 'Distance required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('start_location', 'Start location required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('end_location', 'End location required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('elevation', 'Elevation required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('track', 'Track code required')
        .trim()
        .isLength({ min: 1, max: 10000 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Modality object with escaped and trimmed data.
        const modality = new Modality({
            race: req.body.race,
            distance: req.body.distance,
            start_location: req.body.start_location,
            end_location: req.body.end_location,
            elevation: req.body.elevation,
            track: req.body.track,
            _id: req.params.id, // This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.

            // Get all the races and locations available to choose from.
            const [races, locations] = await Promise.all([
                Race.find().sort({ name: 1 }).exec(),
                Location.find().sort({ city: 1 }).exec(),
            ]);

            res.render('modality_form', {
                title: 'Update Modality',
                modality: modality,
                errors: errors.array(),
                layout: 'layout',
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            await Modality.findByIdAndUpdate(req.params.id, modality, {});
            res.redirect(modality.url);
        }
    }),
];