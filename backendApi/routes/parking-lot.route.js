const ParkingLotController = require('../controllers/parking-lot.controller');
const { verifyAccessToken } = require('../Helpers/jwt_helper');
const router = require('express').Router();

router.post('/', verifyAccessToken, ParkingLotController.create);

router.get('/:id', verifyAccessToken, ParkingLotController.get);

router.get('/', verifyAccessToken, ParkingLotController.list);

router.put('/:id', verifyAccessToken, ParkingLotController.update);

router.delete('/:id', verifyAccessToken, ParkingLotController.delete);

router.put('/:id/restore', verifyAccessToken, ParkingLotController.restore);

module.exports = router;