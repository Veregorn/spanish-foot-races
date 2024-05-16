const express = require('express');
const router = express.Router();

// Require controller modules.
const instanceController = require('../controllers/instanceController');
const locationController = require('../controllers/locationController');
const categoryController = require('../controllers/categoryController');
const raceController = require('../controllers/raceController');
const modalityController = require('../controllers/modalityController');

/// INSTANCE ROUTES ///

// GET home page.
router.get('/', instanceController.index);

// GET request for creating a Instance. NOTE This must come before routes that display Instance (uses id).
router.get('/instance/create', instanceController.instance_create_get);

// POST request for creating Instance.
router.post('/instance/create', instanceController.instance_create_post);

// GET request to delete Instance.
router.get('/instance/:id/delete', instanceController.instance_delete_get);

// POST request to delete Instance.
router.post('/instance/:id/delete', instanceController.instance_delete_post);

// GET request to update Instance.
router.get('/instance/:id/update', instanceController.instance_update_get);

// POST request to update Instance.
router.post('/instance/:id/update', instanceController.instance_update_post);

// GET request for one Instance.
router.get('/instance/:id', instanceController.instance_detail);

// GET request for list of all Instance.
router.get('/instances', instanceController.instance_list);

/// LOCATION ROUTES ///

// GET request for creating a Location. NOTE This must come before route for id (i.e. display location).
router.get('/location/create', locationController.location_create_get);

// POST request for creating Location.
router.post('/location/create', locationController.location_create_post);

// GET request to delete Location.
router.get('/location/:id/delete', locationController.location_delete_get);

// POST request to delete Location.
router.post('/location/:id/delete', locationController.location_delete_post);

// GET request to update Location.
router.get('/location/:id/update', locationController.location_update_get);

// POST request to update Location.
router.post('/location/:id/update', locationController.location_update_post);

// GET request for one Location.
router.get('/location/:id', locationController.location_detail);

// GET request for list of all Location.
router.get('/locations', locationController.location_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category. NOTE This must come before route that displays Category (uses id).
router.get('/category/create', categoryController.category_create_get);

// POST request for creating Category.
router.post('/category/create', categoryController.category_create_post);

// GET request to delete Category.
router.get('/category/:id/delete', categoryController.category_delete_get);

// POST request to delete Category.
router.post('/category/:id/delete', categoryController.category_delete_post);

// GET request to update Category.
router.get('/category/:id/update', categoryController.category_update_get);

// POST request to update Category.
router.post('/category/:id/update', categoryController.category_update_post);

// GET request for one Category.
router.get('/category/:id', categoryController.category_detail);

// GET request for list of all Category.
router.get('/categories', categoryController.category_list);

/// RACES ROUTES ///

// GET request for creating a Race. NOTE This must come before route that displays Race (uses id).
router.get('/race/create', raceController.race_create_get);

// POST request for creating Race.
router.post('/race/create', raceController.race_create_post);

// GET request to delete Race.
router.get('/race/:id/delete', raceController.race_delete_get);

// POST request to delete Race.
router.post('/race/:id/delete', raceController.race_delete_post);

// GET request to update Race.
router.get('/race/:id/update', raceController.race_update_get);

// POST request to update Race.
router.post('/race/:id/update', raceController.race_update_post);

// GET request for one Race.
router.get('/race/:id', raceController.race_detail);

// GET request for list of all Race.
router.get('/races', raceController.race_list);

/// MODALITY ROUTES ///

// GET request for creating a Modality. NOTE This must come before route that displays Modality (uses id).
router.get('/modality/create', modalityController.modality_create_get);

// POST request for creating Modality.
router.post('/modality/create', modalityController.modality_create_post);

// GET request to delete Modality.
router.get('/modality/:id/delete', modalityController.modality_delete_get);

// POST request to delete Modality.
router.post('/modality/:id/delete', modalityController.modality_delete_post);

// GET request to update Modality.
router.get('/modality/:id/update', modalityController.modality_update_get);

// POST request to update Modality.
router.post('/modality/:id/update', modalityController.modality_update_post);

// GET request for one Modality.
router.get('/modality/:id', modalityController.modality_detail);

// GET request for list of all Modality.
router.get('/modalities', modalityController.modality_list);

module.exports = router;