const ParkingModel = require('../models/parking.model');
const CarModel = require('../models/car.model');

exports.test = async (req, res, next) => {
  try {
    res.json('test');
  } catch (error) {
    next(error);
  }
};

exports.createParking = async (req, res, next) => {
  console.log('createParking');
  try {
    const { body } = req;
    const data = {
      nameParking: body.nameParking,
      parkingLots: body.parkingLots,
      created: new Date(),
      lastUpdate: new Date(),

    };
    const createParking = await new ParkingModel(data).save();
    res.json({ success: true, data: createParking });
  } catch (error) {
    next(error);
  }
};

exports.getAllParking = async (req, res, next) => {
  console.log('getAllParking');
  try {
    const parking = await ParkingModel.find({});
    res.json({ success: true, data: parking });
  } catch (error) {
    next(error);
  }
};

exports.getParkingById = async (req, res, next) => {
  console.log('getParkingById');
  try {
    const { parkingId } = req.query;
    const parking = await ParkingModel.findOne({ _id: parkingId });
    res.json({ success: true, data: parking });
  } catch (error) {
    next(error);
  }
};

exports.getStatusParkingLots = async (req, res, next) => {
  console.log('getStatusParkingLots');
  try {
    const { parkingId } = req.query;
    const parking = await ParkingModel.findOne({ _id: parkingId });
    const listCar = await CarModel.find({ parkingId, status: { $in: ['check in', 'pending'] } });
    // const listCarCheckIn = await CarModel.find({ parkingId, status: 'check in' });
    // const listCarPending = await CarModel.find({ parkingId, status: 'pending' });
    const totalCarCheckInS = listCar.filter(itemCar => itemCar.sizeCar === 'small' && itemCar.status === 'check in').length;
    const totalCarCheckInM = listCar.filter(itemCar => itemCar.sizeCar === 'medium' && itemCar.status === 'check in').length;
    const totalCarCheckInL = listCar.filter(itemCar => itemCar.sizeCar === 'large' && itemCar.status === 'check in').length;
    console.log('totalCarCheckInL: ', totalCarCheckInL);
    let status;
    if (parking.parkingLots.small === totalCarCheckInS &&
      parking.parkingLots.medium === totalCarCheckInM &&
      parking.parkingLots.large === totalCarCheckInL) {
      status = 'full';
    } else {
      status = 'available';
    }

    const numberOfAvailableSlot = {
      small: parking.parkingLots.small - totalCarCheckInS,
      medium: parking.parkingLots.medium - totalCarCheckInM,
      large: parking.parkingLots.large - totalCarCheckInL,
    };

    res.json({
      success: true,
      data: { status, numberOfAvailableSlot },
    });
  } catch (error) {
    next(error);
  }
};

