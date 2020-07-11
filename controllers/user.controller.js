'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if(params.name&&
        params.username&&
        params.email&&
        params.phone&&
        params.password){

        User.findOne({$or:[{username: params.username},{email: params.email}]}, (err, userFinded)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL'});
            }else if(userFinded){
                res.send({message: 'Nombre de usuario, o direccion del correo ya en uso, use otro!'});
            }else{
                user.name = params.name;
                user.lastname = params.lastname;
                user.phone = params.phone;
                user.email = params.email;
                user.username = params.username;
                user.role = 'USER';

                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        res.status(500).send({message: 'ERROR GENERAL password'});
                    }else if(passwordHash){
                        user.password = passwordHash;

                        user.save((err, userSaved)=>{
                            if(err){
                                res.status(500).send({message: 'ERROR GENERAL'});
                            }else if(userSaved){
                                res.send({message: 'Usuario creado exitosamente', user: userSaved});
                            }else{
                                res.send({message:'Usuario no guardado :('});
                            }
                        })
                    }else{
                        res.send({message: 'Usuario no Guardado! :('});
                    }
                });
            }
        });

    }
}

function deleteUser(req, res){
    var userId = req.params.Id;

    User.findByIdAndRemove(userId, (err, userDeleted)=>{
        if(err){
            res.status(500).send({message: 'ERROR GENERAL'});
        }else if(userDeleted){
            res.send({message: 'Usuario eliminado exitosamente', user: userDeleted});
        }else{
            res.send({message: 'ERROR, usuario no eliminado'});
        }
    });
}

function updateUser(req, res){
    var userId = req.params.Id;
    var update = req.params;

    User.findByIdAndUpdate(userId, update,(err, userUpdated)=>{
        if(err){
            res.status(500).send({message: 'ERROR GENERAL'});
        }else if(userUpdated){
            res.send({message: 'Usuario actualizado exitosamente', user: userUpdated});
        }else{
            res.send({message: 'ERROR, usuario no actualizado'});
        }
    });
}


function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            User.findOne({$or:[{username: params.username}, 
                {email: params.email}]}, (err, check)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(check){
                        bcrypt.compare(params.password, check.password, (err, passworOk)=>{
                            if(err){
                                res.status(500).send({message: 'Error al comparar'});
                            }else if(passworOk){
                                if(params.gettoken = true){
                                    res.send({token: jwt.createHotelToken(check)});
                                }else{
                                    res.send({message: 'Bienvenido',hotel:check});
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
        res.send({message: 'Ingresa tu correo o tu username'});
    }
}

module.exports ={
    saveUser,
    login,
    deleteUser,
    updateUser
}