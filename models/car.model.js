const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  parkingId: {
    type: String,
    ref: 'Parking',
  },
  numberPlate: {
    type: String,
    require: true,
  },
  sizeCar: {
    type: String,
    require: true,
  },
  parkingNumber: {
    type: String,
    require: true,
  },
  queueNumber: {
    type: String,
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
