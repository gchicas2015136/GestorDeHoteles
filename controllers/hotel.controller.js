'use strict'

var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');



function saveHotel(req, res){
    var hotel = new Hotel();
    var params = req.body;

    if(params.name &&
       params.phone &&
       params.email &&
       params.address &&
       params.username &&
       params.password){

        Hotel.findOne({$or:[{username: params.username}, {email: params.email}, {address: params.address}]}, (err, hotelFinded)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL'})
            }else if(hotelFinded){
                res.send({message: '!Nombre de usuario, correo o direccion del correo ya en uso, use otro!'});
            }else{
                hotel.name = params.name;
                hotel.username = params.username;
                hotel.email = params.email;
                hotel.address = params.address;

                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        res.status(500).send({message: 'ERROR GENERAL en la contraseña :('});
                    }else if(passwordHash){
                        hotel.password = passwordHash;

                        hotel.save((err, hotelSaved)=>{
                            if(err){
                                res.status(500).send({message: 'ERROR GENERAL'});
                            }else if(hotelSaved){
                                res.send({message: 'Hotel creado exitosamente: ', hotel: hotelSaved});
                            }else{
                                res.status(404).send({message: 'Hotel no guardado, algo ha salido mal... :('});
                            }
                        });
                    }else{
                        res.status(404).send({message: 'Hotel no guardado'});
                    }
                });
            }
        });
    }else{
        res.send({message: 'Ingrese todos los datos'});
    }
}

function deleteHotel(req, res){
    var hotelId = req.params.Id;
 
        Hotel.findByIdAndRemove(hotelId, (err, hotelDeleted)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL'});
            }else if(hotelDeleted){
                res.send({message: 'Hotel eliminado exitosamente: ', hotel: hotelDeleted});
            }else{
                res.send({message: 'ERROR Inesperado, Hotel no eliminado'});
            }
        });
    }


function updateHotel(req, res){
    var hotelId = req.params.Id;
    var update = req.body;

        Hotel.findOneAndUpdate(hotelId, update, {new: true}, (err, hotelUpdated)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENRAL'});
            }else if(hotelUpdated){
                res.send({hotel: hotelUpdated});
            }else{
                res.status(404).send({message: 'NO se pudo actualizar el hotel'});
            }
        });
    }


function hotelLogin(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            Hotel.findOne({$or:[{username: params.username}, 
                {email: params.email}]}, (err, check)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(check){
                        bcrypt.compare(params.password, check.password, (err, passworOk)=>{
                            if(err){
                                res.status(500).send({message: 'Error al comparar'});
                            }else if(passworOk){
                                if(params.gettoken = true){
                                    res.send({token: jwt.createUserToken(check)});
                                }else{
                                    res.send({message: 'Bienvenido',user:check});
                                }
                            }else{
                                res.send({message: 'Contraseña incorrecta'});
                            }
                        });
                    }else{
                        res.send({message: 'Datos de usuario incorrectos'});
                    }
                });
        }else{
           res.send({message: 'Ingresa tu contraseña'}); 
        }
    }else{
        res.send({message: 'Ingresa tu correo o tu usuario'});
    }
}


module.exports = {
    saveHotel,
    deleteHotel,
    updateHotel,
    hotelLogin
}