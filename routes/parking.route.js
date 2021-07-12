const express = require('express');
// const { route } = require('.');
const controller = require('../controllers/parking.controller');

const router = express.Router();
router.route('/test').get(controller.test);
router.route('/createCarPark').post(controller.createParking);
router.route('/all').get(controller.getAllParking);
router.route('/getParkingById').get(controller.getParkingById);
router.route('/getStatusParkingLots').get(controller.getStatusParkingLots);

module.exports = router;
