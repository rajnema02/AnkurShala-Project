const ParkingLotAreaController = require('../controllers/parking-lot-area.controller');
const { verifyAccessToken } = require('../Helpers/jwt_helper');
const router = require('express').Router();

router.post('/', verifyAccessToken, ParkingLotAreaController.create);

router.get('/:id', verifyAccessToken, ParkingLotAreaController.get);

router.get('/', verifyAccessToken, ParkingLotAreaController.list);

router.put('/:id', verifyAccessToken, ParkingLotAreaController.update);

router.delete('/:id', verifyAccessToken, ParkingLotAreaController.delete);

router.put('/:id/restore', verifyAccessToken, ParkingLotAreaController.restore);

module.exports = router;