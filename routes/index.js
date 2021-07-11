const express = require('express');
const parkingRoutes = require('./parking.route');
const carRoutes = require('./car.route');

const router = express();

router.use('/parkings', parkingRoutes);
router.use('/cars', carRoutes);

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
module.exports = router;
