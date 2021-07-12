const CarModel = require('../models/car.model');
const ParkingModel = require('../models/parking.model');

exports.test = async (req, res, next) => {
  try {
    res.json('test');
  } catch (error) {
    next(error);
  }
};

exports.createCar = async (req, res, next) => {
  console.log('createCar');
  try {
    const { body } = req;
    const data = {
      parkingId: body.parkingId,
      numberPlate: body.numberPlate,
      sizeCar: body.sizeCar,
      checkInTime: '',
      checkOutTime: '',
      created: new Date(),
    };
    const checkNumberCar = await CarModel.findOne({ numberPlate: body.numberPlate, status: { $not: { $regex: 'check out' } } });
    if (checkNumberCar) {
      res.json({ success: false, message: 'เลขทะเบียนรถนี้อยู่ในระบบแล้ว', en: 'Number plate is invalid.' });
      return null;
    }
    const parking = await ParkingModel.findOne({ _id: body.parkingId });
    let parkingLots;
    let size;
    if (body.sizeCar === 'small') {
      parkingLots = parking.parkingLots.small;
      size = 'S';
    } else if (body.sizeCar === 'medium') {
      parkingLots = parking.parkingLots.medium;
      size = 'M';
    } else if (body.sizeCar === 'large') {
      parkingLots = parking.parkingLots.large;
      size = 'L';
    }
    if (parkingLots === 0) {
      res.json({ success: false, message: 'รถของท่านไม่สามารถเข้าจอดได้ เนื่องจากที่จอดรถไม่รองรับรถไซส์นี้' });
      return null;
    }
    const findCar = await CarModel.find({ parkingId: body.parkingId, sizeCar: body.sizeCar, status: 'check in' });
    const arrQueueNo = [];
    if (!findCar) {
      data.parkingNumber = `${size}1`;
      data.status = 'check in';
      data.queueNumber = '';
      data.checkInTime = new Date();
    } else if (findCar && findCar.length !== parkingLots) {
      data.parkingNumber = `${size}${findCar.length + 1}`;
      data.status = 'check in';
      data.queueNumber = '';
      data.checkInTime = new Date();
    } else if (findCar && findCar.length === parkingLots) {
      data.parkingNumber = '';
      data.status = 'pending';
      const findCarPending = await CarModel.find({ sizeCar: body.sizeCar, status: 'pending' });
      findCarPending.forEach((itemCar) => {
        const queue = parseInt(itemCar.queueNumber, 10);
        arrQueueNo.push(queue);
      });
      const maxQueueNo = arrQueueNo.length === 0 ? 0 : Math.max(...arrQueueNo);
      data.queueNumber = maxQueueNo + 1;
    }
    const createCar = await new CarModel(data).save();
    res.json({ success: true, data: createCar });
  } catch (error) {
    next(error);
  }
};

exports.getAllCar = async (req, res, next) => {
  console.log('getAllCar');
  try {
    const car = await CarModel.find({});
    res.json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};

exports.getCarById = async (req, res, next) => {
  console.log('getCarById');
  try {
    const { carId } = req.query;
    const car = await CarModel.findOne({ _id: carId });
    if (!car) {
      res.json({ success: false, message: 'ไม่พบข้อมูล' });
      return null;
    }
    const data = {
      _id: car._id,
      parkingId: car.parkingId,
      numberPlate: car.numberPlate,
      sizeCar: car.sizeCar,
      parkingNumber: car.parkingNumber,
      queueNumber: car.queueNumber,
      status: car.status,
      checkInTime: car.checkInTime,
    };
    if (car.status === 'pending') {
      const findCarCheckIn = await CarModel.find({ parkingId: car.parkingId, status: 'check in' });
      const findCurrentQueue = findCarCheckIn.filter(itemCar => itemCar.queueNumber !== '');
      findCurrentQueue.sort((a, b) => ((a.created > b.created) ? -1 : 1));
      data.currentQueue = findCurrentQueue.length !== 0 ? findCurrentQueue[0].queueNumber : '0';
    }
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getListNumberPlateBySize = async (req, res, next) => {
  console.log('getListPlateNumberBySize');
  try {
    const { parkingId, sizeCar } = req.query;
    const car = await CarModel.find({ parkingId, sizeCar }).sort({ created: 1 });
    if (car.length === 0) {
      res.json({ sucess: false, message: 'ไม่พบข้อมูล' });
      return null;
    }
    const listCar = [];
    car.forEach((itemCar) => {
      const data = {
        _id: itemCar._id,
        numberPlate: itemCar.numberPlate,
      };
      listCar.push(data);
    });

    res.json({ success: true, listCar });
  } catch (error) {
    next(error);
  }
};

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
    });
  } catch (error) {
    next(error);
  }
};

exports.leaveCar = async (req, res, next) => {
  console.log('leaveCar');
  try {
    const { parkingId, numberPlate } = req.query;
    const car = await CarModel.findOne({ parkingId, numberPlate, status: 'pending' });
    if (!car) {
      res.json({ success: false, message: 'ไม่พบข้อมูล' });
      return null;
    }
    car.status = 'leave';
    const update = await car.save();
    res.json({ success: true, data: update });
  } catch (error) {
    next(error);
  }
};

exports.checkOut = async (req, res, next) => {
  console.log('checkOut');
  try {
    const { parkingId, numberPlate } = req.query;
    console.log('numberPlate: ', numberPlate);
    const car = await CarModel.findOne({ parkingId, numberPlate, status: 'check in' });
    if (!car) {
      res.json({ success: false, message: 'ไม่พบข้อมูล ' });
      return null;
    }
    car.status = 'check out';
    car.checkOutTime = new Date();
    const updateCar = await car.save();

    const checkCarPending = await CarModel.find({ parkingId: car.parkingId, sizeCar: car.sizeCar, status: 'pending' }).sort({ created: 1 });
    if (checkCarPending.length !== 0) {
      checkCarPending[0].parkingNumber = car.parkingNumber;
      checkCarPending[0].status = 'check in';
      checkCarPending[0].checkInTime = new Date();
      await checkCarPending[0].save();
    }
    res.json({ success: true, data: updateCar });
  } catch (error) {
    next(error);
  }
};
