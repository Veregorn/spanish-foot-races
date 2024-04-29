const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true, max: 100 },
    description: { type: String, max: 1000 },
});

// Virtual for category's URL
CategorySchema
    .virtual('url')
    .get(function() {
        return '/catalog/category/' + this._id;
    });

// Export model
module.exports = mongoose.model('Category', CategorySchema);