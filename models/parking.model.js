const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
    nameParking: {
        type: String,
        require: true,
    },
    parkingLots: {
        small: Number,
        medium: Number,
        large: Number
    },
    created: {
        type: Date,
    },
    lastUpdate: {
        type: Date,
    }
});

parkingSchema.statics = {

};

module.exports = mongoose.model('Parking', parkingSchema);