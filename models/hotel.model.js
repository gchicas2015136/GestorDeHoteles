'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    name: String,
    address: String,
    phone: String,
    email: String,
    username: String,
    password: String,
    disponibility: [{
        date1: String,
        date2: String
    }],
    price: Number
});

module.exports = mongoose.model('hotel', hotelSchema);