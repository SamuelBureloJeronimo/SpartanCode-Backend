const app = require('./app');
const mongoose = require('mongoose');

//Conexión a la base de datos mongodb con mongoose
mongoose.connect('mongodb+srv://shmekercross:8uv9jW6HbpxvqMqM@spartansdb.il0plho.mongodb.net/slava-shop?retryWrites=true&w=majority')
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