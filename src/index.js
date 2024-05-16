const app = require('./app');
const mongoose = require('mongoose');

//Conexión a la base de datos mongodb con mongoose
mongoose.connect("mongodb://127.0.0.1:27017/slava-shop")
    .then(() => {
        console.log('conectado');
    })
    .catch((err) =>{
        console.log(err.message);
    });

//Arranque del servidor
app.listen(app.get('port'), () => {
    console.log(`Estas corriendo el puerto ${app.get('port')}`);
});