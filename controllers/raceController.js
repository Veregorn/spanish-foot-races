const Race = require('../models/race');
const Modality = require('../models/modality');
const asyncHandler = require('express-async-handler');

// Display list of all races.
exports.race_list = asyncHandler(async (req, res, next) => {
    const races = await Race.find({}, 'name category')
        .sort({ name: 1})
        .populate('category')
        .exec();

    res.render('race_list', {
        title: 'Race list',
        race_list: races,
        layout: 'layout'
    });
});

// Display detail page for a specific Race.
exports.race_detail = asyncHandler(async (req, res, next) => {
    // Get details for the requested race, including the category and all the modalities that belongs to that race.
    const [ race, modalitiesInRace ] = await Promise.all([
        Race.findById(req.params.id)
            .populate('category')
            .exec(),
        Modality.find({race: req.params.id}).exec()
    ]);

    if (race == null) {
        const err = new Error('Race not found');
        err.status = 404;
        return next(err);
    }

    res.render('race_detail', {
        title: 'Race Detail',
        race: race,
        race_modalities: modalitiesInRace,
        layout: 'layout'
    });
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