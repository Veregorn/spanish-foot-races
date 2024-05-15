const Category = require('../models/category');
const Instance = require('../models/instance');
const Modality = require('../models/modality');
const Location = require('../models/location');
const Race = require('../models/race');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const race = require('../models/race');

// Display the home page.
exports.index = asyncHandler(async (req, res) => {
    // Get the count of each model.
    const [
        categoryCount,
        instanceCount,
        modalityCount,
        locationCount,
        raceCount,
    ] = await Promise.all([
        Category.countDocuments({}).exec(),
        Instance.countDocuments({}).exec(),
        Modality.countDocuments({}).exec(),
        Location.countDocuments({}).exec(),
        Race.countDocuments({}).exec(),
    ]);

    res.render('index', {
        category_count: categoryCount,
        instance_count: instanceCount,
        modality_count: modalityCount,
        location_count: locationCount,
        race_count: raceCount,
        layout: 'layout',
    });
});

// Display list of all Instances.
exports.instance_list = asyncHandler(async (req, res, next) => {
    const instances = await Instance.find({}, 'modality date')
        .sort({ date: 1 })
        .populate({
            path: 'modality',
            populate: {
                path: 'race',
                select: 'name',
            },
        })
        .exec();

    res.render('instance_list', {
        title: 'Instance List',
        instance_list: instances,
        layout: 'layout',
    });
});

// Display detail page for a specific Instance.
exports.instance_detail = asyncHandler(async (req, res, next) => {
    // Get details for the requested instance
    const instance = await Instance.findById(req.params.id)
        .populate({
            path: 'modality',
            populate: {
                path: 'race',
                select: 'name',
            },
        })
        .exec();

    if (instance == null) {
        const err = new Error('Instance not found');
        err.status = 404;
        return next(err);
    }

    res.render('instance_detail', { 
        title: 'Instance Detail',
        instance: instance,
        layout: 'layout',
    });
});

// Display Instance create form on GET.
exports.instance_create_get = asyncHandler(async (req, res) => {
    // Get all the modalities available to choose from and populate the name of every race.
    const modalities = await Modality.find().sort({ distance: 1 }).populate('race').exec();

    res.render('instance_form', {
        title: 'Create Instance',
        instance: null,
        modalities: modalities,
        errors: null,
        layout: 'layout',
    });
});

// Handle Instance create on POST.
exports.instance_create_post = [
    // Validate and sanitize fields.
    body('modality', 'Modality must be specified')
        .isLength({ min: 1 })
        .trim()
        .escape(),
    body('date', 'Date must be specified')
        .isISO8601()
        .toDate(),
    body('price', 'Price must be specified and greater than or equal to 0')
        .isNumeric()
        .toFloat()
        .isFloat({ min: 0 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create an instance object with escaped and trimmed data.
        const instance = new Instance({
            modality: req.body.modality,
            date: req.body.date,
            price: req.body.price,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            
            // Get all the modalities available to choose from and populate the name of every race.
            const modalities = await Modality.find().sort({ distance: 1 }).populate('race').exec();

            res.render('instance_form', {
                title: 'Create Instance',
                instance: instance,
                modalities: modalities,
                errors: errors.array(),
                layout: 'layout',
            });
            return;
        }

        try {
            // Check if an instance with the same modality and date already exists.
            const foundInstance = await Instance.findOne({ modality: instance.modality, date: instance.date }).exec();
            if (foundInstance) {
                res.redirect(foundInstance.url);
            } else {
                // Save the instance.
                await instance.save();
                res.redirect(instance.url);
            }
        } catch (error) {
            return next(error);
        }
    }),
];
    
// Display Instance delete form on GET.
exports.instance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Instance delete GET');
};

// Handle Instance delete on POST.
exports.instance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Instance delete POST');
};

// Display Instance update form on GET.
exports.instance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Instance update GET');
};

// Handle Instance update on POST.
exports.instance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Instance update POST');
};