const Category = require('../models/category');
const Instance = require('../models/instance');
const Modality = require('../models/modality');
const Location = require('../models/location');
const Race = require('../models/race');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
exports.instance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Instance create GET');
};

// Handle Instance create on POST.
exports.instance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Instance create POST');
};

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