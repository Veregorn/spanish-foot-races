const mongoose = require('mongoose');
const modality = require('./modality');

const Schema = mongoose.Schema;

const InstanceSchema = new Schema({
    modality: { type: Schema.Types.ObjectId, ref: 'Modality', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true, max: 100 },
    price: { type: Number, required: true },
});

// Virtual for instance's URL
InstanceSchema
    .virtual('url')
    .get(function() {
        return '/catalog/instance/' + this._id;
    });

// Export model
module.exports = mongoose.model('Instance', InstanceSchema);