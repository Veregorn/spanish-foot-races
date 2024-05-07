const Modality = require('../models/modality');
const asyncHandler = require('express-async-handler');

// Display list of all Modalities.
exports.modality_list = asyncHandler(async function(req, res, next) {
    const modalities = await Modality.find();
    res.render('modality_list', { title: 'Modality List', modalities });
});

// Display detail page for a specific Modality.
exports.modality_detail = asyncHandler(async function(req, res, next) {
    const modality = await Modality.findById(req.params.id);
    res.render('modality_detail', { title: 'Modality Detail', modality });
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