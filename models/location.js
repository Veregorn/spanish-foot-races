const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    city: { type: String, required: true, max: 100 },
    country: { type: String, required: true, max: 100 },
});

// Virtual for location's URL
LocationSchema
    .virtual('url')
    .get(function() {
        return '/catalog/location/' + this._id;
    });

// Export model
module.exports = mongoose.model('Location', LocationSchema);