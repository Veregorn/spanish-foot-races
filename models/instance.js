const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const InstanceSchema = new Schema({
    modality: { type: Schema.Types.ObjectId, ref: 'Modality', required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
});

// Virtual for instance's URL
InstanceSchema
    .virtual('url')
    .get(function() {
        return '/catalog/instance/' + this._id;
    });

// Virtual for formatted date
InstanceSchema
    .virtual('formatted_date')
    .get(function() {
        return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
    });

// Export model
module.exports = mongoose.model('Instance', InstanceSchema);