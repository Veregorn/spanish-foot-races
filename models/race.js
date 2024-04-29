const mongoose = require('mongoose');
const category = require('./category');
const location = require('./location');
const modality = require('./modality');

const Schema = mongoose.Schema;

const RaceSchema = new Schema({
    name: { type: String, required: true, max: 200 },
    start_location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    end_location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    modality: { type: Schema.Types.ObjectId, ref: 'Modality', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, max: 1000 },
    image_url: { type: String, max: 1000 },
});

// Virtual for race's URL
RaceSchema
    .virtual('url')
    .get(function() {
        return '/catalog/race/' + this._id;
    });

// Export model
module.exports = mongoose.model('Race', RaceSchema);