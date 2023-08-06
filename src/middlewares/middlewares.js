const morgan = require('morgan');
const express = require('express');

//Middlewares
const mor = morgan('dev');  //Morgan es para comentar las peticiones
const map = express.json(); //Enviar los datos a json
const file = express.urlencoded({extended: false});

module.exports = {
    mor,
    map,
    file
};