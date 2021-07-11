const ParkingModel = require('../models/parking.model');

exports.test = async (req, res, next) => {
    try {
        res.json('test');
    } catch (error) {
        next(error);
    }
}

exports.createParking = async (req, res, next) => {
    console.log('createParking');
    try {
        const { body } = req;
        const data = {
            nameParking: body.nameParking,
            parkingLots: body.parkingLots,
            created: new Date(),
            lastUpdate: new Date,

        }
        const createParking = await new ParkingModel(data).save();
        res.json({ success: true, data: createParking });
    } catch (error) {
        next(error);
    }
}

exports.getAllParking = async (req, res, next) => {
    console.log('getAllParking');
    try {
        const parking = await ParkingModel.find({});
        res.json({ success: true, data: parking });
    } catch (error) {
        next(error);
    }
}

exports.getParkingById = async (req, res, next) => {
    console.log('getParkingById');
    try {
        const { parkingId } = req.query;
        const parking = await ParkingModel.findOne({ _id: parkingId });
        res.json({ success: true, data: parking });
    } catch (error) {
        next(error);
    }
}



