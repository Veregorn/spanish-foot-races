const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    city: { type: String, required: true, max: 100 },
    community: { 
        type: String,
        required: true,
        enum: ['Andalucía', 'Aragón', 'Asturias', 'Islas Baleares', 'Islas Canarias', 'Cantabria', 'Castilla y Leon', 'Castilla-La Mancha', 'Cataluña', 'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Comunidad de Madrid', 'Región de Murcia', 'Comunidad Foral de Navarra', 'País Vasco', 'La Rioja', 'Ceuta', 'Melilla'],
    },
});

// Virtual for location's URL
LocationSchema
    .virtual('url')
    .get(function() {
        return '/catalog/location/' + this._id;
    });

// Export model
module.exports = mongoose.model('Location', LocationSchema);