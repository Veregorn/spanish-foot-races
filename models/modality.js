const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModalitySchema = new Schema({
    race: { type: Schema.Types.ObjectId, ref: 'Race', required: true },
    start_location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    end_location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    distance: { type: Number, required: true },
    elevation: { type: Number, required: true },
    track: { type: String, required: true, max: 10000 },
});

// Virtual for modality's URL
ModalitySchema
    .virtual('url')
    .get(function() {
        return '/catalog/modality/' + this._id;
    });

// Export model
module.exports = mongoose.model('Modality', ModalitySchema);