const Instance = require('../models/instance');
const asyncHandler = require('express-async-handler');

// Display the home page.
exports.index = function(req, res) {
    res.render('index', { title: 'Home Page' });
};

// Display list of all Instances.
exports.instance_list = asyncHandler(async function(req, res, next) {
    const instances = await Instance.find();
    res.render('instance_list', { title: 'Instance List', instances });
});

// Display detail page for a specific Instance.
exports.instance_detail = asyncHandler(async function(req, res, next) {
    const instance = await Instance.findById(req.params.id);
    res.render('instance_detail', { title: 'Instance Detail', instance });
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