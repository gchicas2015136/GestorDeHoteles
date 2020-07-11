'use strict'

var mongoose = require('mongoose');
var port = 3800;
var app = require('./app');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/GestorDeHotelesDB', {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false})
.then(()=>{
    console.log('!Conexión a la base de datos Correcta! :)');
    app.listen(port, ()=>{
        console.log('Servidor de express corriendo en el puerto: ', port);
    });
}).catch(err =>{
    console.log('Error al tratar de conectarse a la Base de Datos :(', err);
});