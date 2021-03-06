'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/saveUser',userController.saveUser); 
api.post('/login',userController.login);
api.delete('/deleteUser', mdAuth.ensureAuth, userController.deleteUser);
api.put('/putUser', mdAuth.ensureAuth, userController.updateUser);

module.exports = api;