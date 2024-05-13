const Modality = require('../models/modality');
const asyncHandler = require('express-async-handler');
const Instance = require('../models/instance');

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
exports.modality_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Modality create GET');
};

// Handle Modality create on POST.
exports.modality_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Modality create POST');
};

// Display Modality delete form on GET.
exports.modality_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Modality delete GET');
};

// Handle Modality delete on POST.
exports.modality_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Modality delete POST');
};

// Display Modality update form on GET.
exports.modality_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Modality update GET');
};

// Handle Modality update on POST.
exports.modality_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Modality update POST');
};