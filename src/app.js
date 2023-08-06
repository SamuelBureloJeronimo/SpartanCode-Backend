const express = require('express');
const mid = require('./middlewares/middlewares');
const mult = require('./middlewares/multer');
const router = require('./routes/index.routes');
const user = require('./routes/user.routes');
const category = require('./routes/category.routes');
const brand = require('./routes/brand.routes');
const product = require('./routes/product.routes');
const sale = require('./routes/sale.routes');
const status = require('./routes/status.routes');
const tokenSettings = require('./routes/tokenValidate.routes');
const address = require('./routes/address.routes');
const axios = require('./routes/apiAxios.routes');
const cart = require('./routes/cart.routes');

const path = require('path');

const keys = require('./settings/keys');

const app = express();

//middleware
app.use(mid.map, mid.mor, mid.file, mult);

//settings
app.set('port', process.env.PORT || 3000);
app.set('key', keys.key1);


// Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Allow', 'GET', 'POST', 'PUT', 'DELETE');
    res.header()
    next();
});

//rutas de la app
app.use('/api', router, user, category, brand, product, sale, status, tokenSettings, address, axios, cart);
app.use('/api', express.static(path.join(__dirname, '../public')));

module.exports = app;