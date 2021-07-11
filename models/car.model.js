const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    parkingId: {
        type: String,
        ref: '',
    },
    numberPlate: {
        type: String,
        require: true,
    },
    sizeCar: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true,
    },
    checkInTime: {
        type: Date,
    },
    checkOutTime: {
        type: Date,
    },
    created: {
        type: Date,
    },
});

carSchema.statics = {

};

module.exports = mongoose.model('Car', carSchema);