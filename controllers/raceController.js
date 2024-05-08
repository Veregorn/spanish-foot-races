const Race = require('../models/race');
const asyncHandler = require('express-async-handler');

// Display list of all races.
exports.race_list = asyncHandler(async (req, res, next) => {
    const races = await Race.find();
    res.render('race_list', { title: 'Race list', races });
});

// Display detail page for a specific Race.
exports.race_detail = asyncHandler(async function(req, res, next) {
    const race = await Race.findById(req.params.id);
    res.render('race_detail', { title: 'Race Detail', race });
});

// Display Race create form on GET.
exports.race_create_get = function(req, res) {
    res.send('NOT IMPLEMENT: Race create GET');
};

// Display Race create form on POST.
exports.race_create_post = function(req, res) {
    res.send('NOT IMPLEMENT: Race create POST');
};

// Display Race delete form on GET.
exports.race_delete_get = function(req, res) {
    res.send('NOT IMPLEMENT: Race delete GET');
};

// Display Race delete form on POST.
exports.race_delete_post = function(req, res) {
    res.send('NOT IMPLEMENT: Race delete POST');
};

// Display Race update form on GET.
exports.race_update_get = function(req, res) {
    res.send('NOT IMPLEMENT: Race update GET');
};

// Display Race update form on POST.
exports.race_update_post = function(req, res) {
    res.send('NOT IMPLEMENT: Race update POST');
};