const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RaceSchema = new Schema({
    name: { type: String, required: true, max: 200 },
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