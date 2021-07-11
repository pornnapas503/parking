const CarModel = require('../models/car.model');
const ParkingModel = require('../models/parking.model');

exports.test = async (req, res, next) => {
    try {
        res.json('test');
    } catch (error) {
        next(error);
    }
}

exports.createCar = async (req, res, next) => {
    console.log('createCar');
    try {
        const { body } = req;
        const data = {
            parkingId: body.parkingId,
            numberPlate: body.numberPlate,
            sizeCar: body.sizeCar,
            checkInTime: new Date(),
            checkOutTime: null,
            created: new Date(),
        }
        const checkNumberCar = await CarModel.findOne({ numberPlate: body.numberPlate, status: { $not : { $regex : 'check out' } } });
        if (checkNumberCar) {
            res.json({ success: false, message: { th: 'เลขทะเบียนรถนี้อยู่ในระบบแล้ว', en: 'Number plate is invalid.' } });
            return null;
        }
        const parking = await ParkingModel.findOne({ _id: body.parkingId });
        let parkingLots;
        if (body.sizeCar === 'small') {
            parkingLots = parking.parkingLots.small;
        } else if (body.sizeCar === 'medium') {
            parkingLots = parking.parkingLots.medium;
        } else if (body.sizeCar === 'large') {
            parkingLots = parking.parkingLots.large;
        }
        const findCar = await CarModel.find({ parkingId: body.parkingId, sizeCar: body.sizeCar, status: 'check in'});
        // const totalCarCheckIn = findCar.filter((itemCar) => { return itemCar.status === 'check in'});
        data.status = findCar.length === parkingLots ? 'pending' : 'check in';
        const createCar = await new CarModel(data).save();
        res.json({ success: true, data: createCar });
    } catch (error) {
        next(error);
    }
}

exports.getAllCar = async (req, res, next) => {
    console.log('getAllCar');
    try {
        const car = await CarModel.find({});
        res.json({ success: true, data: car });
    } catch (error) {
        next(error);
    }
}

exports.getCarBySize = async (req, res, next) => {
    console.log('getCarBySize');
    try {
        const { parkingId, sizeCar } = req.query;
        const car = await CarModel.find({ parkingId, sizeCar });
        res.json({ success: true, data: car });
    } catch (error) {
        next(error);
    }
}

exports.getSlotCarBySize = async (req, res, next) => {
    console.log('getSlotCarBySize');
    try {
        const { parkingId, sizeCar } = req.query;
        const carCheckIn = await CarModel.find({ parkingId, sizeCar, status: 'check in' });
        const carPending = await CarModel.find({ parkingId, sizeCar, status: 'pending' });
        const parking = await ParkingModel.findOne({ _id: parkingId });
        let parkingLots;
        if (sizeCar === 'small') {
            parkingLots = parking.parkingLots.small;
        } else if (sizeCar === 'medium') {
            parkingLots = parking.parkingLots.medium;
        } else if (sizeCar === 'large') {
            parkingLots = parking.parkingLots.large;
        }

        res.json({
            sizeCar,
            parkingLots,
            totalCarInParking: carCheckIn.length,
            totalCarPending: carPending.length,
        })
    } catch (error) {
        next(error);
    }
}

exports.leaveCar = async (req, res, next) => {
    console.log('leaveCar');
    try {
        const { numberPlate } = req.query;
        const car = await CarModel.remove({ numberPlate });
        res.json({ success: true, data: car });
    } catch (error) {
        next(error);
    }
}

exports.checkOut = async (req, res, next) => {
    console.log('checkOut');
    try {
        const { numberPlate } = req.query;
        const car = await CarModel.findOne({ numberPlate, status: 'check in' });
        car.status = 'check out';
        car.checkOutTime = new Date();
        const updateCar = await car.save();

        const checkCarPending = await CarModel.find({ parkingId: car.parkingId, sizeCar: car.sizeCar, status: 'pending'}).sort({ checkInTime: 1 });
        if (checkCarPending.length !== 0) {
            checkCarPending[0].status = 'check in';
            checkCarPending[0].checkInTime = new Date();
            await checkCarPending[0].save();
        }
        res.json({ success: true, data: updateCar });
    } catch (error) {
        next(error);
    }
}
