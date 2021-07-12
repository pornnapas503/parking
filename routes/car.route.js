const express = require('express');
// const { route } = require('.');
const controller = require('../controllers/car.controller');

const router = express.Router();
router.route('/test').get(controller.test);
router.route('/createCar').post(controller.createCar);
router.route('/all').get(controller.getAllCar);
router.route('/getCarById').get(controller.getCarById);
router.route('/getListNumberPlateBySize').get(controller.getListNumberPlateBySize);
router.route('/getSlotCarBySize').get(controller.getSlotCarBySize);
router.route('/leaveCar').put(controller.leaveCar);
router.route('/checkOut').put(controller.checkOut);

module.exports = router;
