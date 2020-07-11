'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var UserKey = 'Token_key_123';
var HotelKey = 'Token_key_321';

exports.createUserToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        phone: user.phone,
        username: user.username,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(15, "minutes").unix()
    }
    return jwt.encode(payload, UserKey);
}

exports.createHotelToken = (hotel)=>{
    var payload = {
        name: hotel.name,
        address: hotel.address,
        phone: hotel.phone,
        email: hotel.email,
        username: hotel.username,
        disponibility: hotel.disponibility,
        price: hotel.price
    }
    return jwt.encode(payload, HotelKey);
}