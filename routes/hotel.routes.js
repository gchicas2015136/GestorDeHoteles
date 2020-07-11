'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');


api.post('/saveHotel', mdAuth.ensureAuthAdmin,hotelController.saveHotel);
api.put('/updateHotel/:Id', mdAuth.ensureAuth,hotelController.updateHotel);
api.delete('/deleteHotel/:Id', mdAuth.ensureAuth, hotelController.deleteHotel);
api.post('/HotelLogin',  hotelController.hotelLogin);

module.exports = api