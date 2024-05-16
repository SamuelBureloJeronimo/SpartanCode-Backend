const Users = require('../models/user.model');
const Product = require('../models/product.model')
const bcrypt = require('bcrypt');
const fs = require('fs');
const userPath = 'user/img/';
const path = require('path');
const settingToken = require('../settings/setting.token');
const keys = require('../settings/keys');

let createUser = async (req, res) => {
    let userModel = new Users();
    try {
        let ext = path.extname(req.file.originalname);
        userModel.nick = req.body.nick;
        userModel.correo_electronico = req.body.correo_electronico;
        userModel.nombre = req.body.nombre;
        userModel.rol = "6463518e9be4555e1669f03f";
        userModel.fecha_registro = new Date();
        userModel.fecha_nacimiento = req.body.fecha_nacimiento;
        userModel.password = req.body.password;
        userModel.sexo = req.body.sexo;
        let user = await Users.findOne({ correo_electronico: userModel.correo_electronico });
        //Case 0:
        if (user) {
            deleteImage(req.file.path);
            return res.json({ msg: 'El correo electronico ya fue registrado' });
        }
            
        const tempPath = req.file.path; // ruta temporal del archivo cargado
        const targetPath = userPath+req.body.correo_electronico+ext; // ubicación final deseada

        userModel.imagen = targetPath;

        //Case 1: Si la marca no existe guarda la coleccion
        moveImage(tempPath, 'public/'+targetPath);

        passwordHashed = await bcrypt.hash(userModel.password, 10);
        userModel.password = passwordHashed;
        await userModel.save();
        res.json({ msg: 'Usuario creado' }).status(200);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }

}

let getUsers = async (req, res) => {
    try {
        let users = await Users.find().populate('rol addresses');
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }

}

let getUser = async (req, res) => {
    let product = new Product();
    try {
        let user = await Users.findById(req.params.id).populate('rol addresses');
        for(let i=0; i<user.carrito.length; i++){
            user.carrito[i].product = await Product.findById(user.carrito[i].product);
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

let updatedUser = async (req, res) => 
{
    try {
        let { id } = req.params;
        let userModel = {
            nick: req.body.nick,
            correo_electronico: req.body.correo_electronico,
            nombre: req.body.nombre,
            rol: req.body.rol,
            fecha_registro: req.body.fecha_registro,
            fecha_nacimiento: req.body.fecha_nacimiento,
            password: req.body.password,
            sexo: req.body.sexo
        }

        let user = await Users.findOne({_id: id});

        //Case 0: Si el usuario no existe manda esta excepcion
        if (!user) 
            return res.status(400).json({ msg: 'El usuario no existe.' });

        // --- Obteniendo los valores a ocupar
        let tempPath; // ruta temporal del archivo cargado
        let targetPath;
        
        //Case 2: Si no manda imagen y no cambia de correo, manda todo de una vez
        if (req.file == undefined && req.body.correo_electronico == undefined)
        {
            if(userModel.password != undefined){
                passwordHashed = await bcrypt.hash(userModel.password, 10);
                userModel.password = passwordHashed;
            }
            let data_updated = await Users.findByIdAndUpdate({_id: id}, userModel);
            return res.status(200).send({ msg: 'Usuario actualizado con exito!!', data_updated, changes: userModel });
        }
        //Case 3: Si no manda imagen y cambia de correo, solo se renombra
        if (req.file == null && req.body.correo_electronico != undefined)
        {
            let ext = path.extname(user.imagen);
            // --- Obteniendo los valores a ocupar
            tempPath = user.imagen; // ruta temporal del archivo cargado
            targetPath = userPath + userModel.correo_electronico + ext; // ubicación final deseada
        }
        //Case 4: Si manda imagen y no cambia de correo, solo se remplaza la imagen
        else if (req.file != null && req.body.correo_electronico == undefined)
        {
            let ext = path.extname(req.file.originalname);
            // --- Obteniendo los valores a ocupar
            tempPath = req.file.path; // ruta temporal del archivo cargado
            targetPath = userPath + user.correo_electronico + ext; // ubicación final deseada
        }
        //Case 5: Si manda imagen y cambia de correo, solo se remplaza la imagen
        else if (req.file != null && req.body.correo_electronico != undefined)
        {
            let ext = path.extname(req.file.originalname);
            // --- Obteniendo los valores a ocupar
            tempPath = req.file.path; // ruta temporal del archivo cargado
            targetPath = userPath + req.body.correo_electronico + ext; // ubicación final deseada
            // --- Elimina la imagen con el nombre anterior
            deleteImage('public/'+user.imagen);
        }
        userModel.imagen = targetPath;
        // --- Renombra el archivo con el nombre nuevo
        moveImage(tempPath,'public/'+targetPath);

        if(userModel.password != undefined){
            passwordHashed = await bcrypt.hash(userModel.password, 10);
            userModel.password = passwordHashed;
        }
        

        let userUpdated = await Users.findByIdAndUpdate({_id: id}, userModel);
        return res.status(200).send({ msg: 'Usuario actualizado con exito!!', userUpdated, changes: userModel });
    } catch(error){
        res.status(404).json({error: error.message});
    }
}

let deleteUser = async (req, res) => {
    try{
        let { id } = req.params;
        let user = await Users.findOne({ _id: id });
        if(!user) 
            return res.json({ msg: "El usuaro no existe" });
            
        // --- Elimino la imagen que corresponde al producto
        deleteImage('public/'+user.imagen);
        let userDeleted = await Users.findByIdAndDelete({ _id: id });
        res.status(200).json({ msg: 'usuario eliminado', userDeleted })

    }catch(error){
        res.json({msg: error.message});
    }
}

let login = async (req, res) => {
    try{
        let { correo_electronico } = req.body;
        let { password } = req.body;
        let user = await Users.findOne({ correo_electronico }).populate('rol addresses');

        if(!user){
            res.json({msg: `Correo electronico y/o contraseña no son correctos`});
            return;
        }
        bcrypt.compare(password, user.password)
            .then((result) => {
                if(result){
                    const payload = {
                        id: user._id,
                        nick: user.nick,
                        correo_electronico: user.correo_electronico,
                        rol: user.rol.nombre
                    }
                    const token = settingToken.createToken(payload);
                    res.json({msg: `Login exitoso`, token: token}).status(200);
                }else{
                    res.json({msg: `Correo electronico y/o contraseña no son correctos`});
                }
            })
            .catch((err) => {
                res.json({error: err.message});
            });
    }catch(err){
        res.json({msg: `Hubo un error: ${err.message}`});
    }
}

/**********************************************************************************************/
let deleteImage = function(route)
{
    // --- Elimino la imagen que corresponde al producto
    fs.unlink(route, err2 => 
    {
        if (!err2)
            console.log('Imagen eliminada exitosamente');
        else
            console.error(err2);
    });
}
let moveImage = function(route, newRoute)
{
    // --- Renombra el archivo con el nombre nuevo
    fs.rename(route, newRoute, err => {
        if (err)
            return console.log("Error al mover la imagen");
        console.log('Archivo subido exitosamente!');
    });
}


module.exports = {
    createUser,
    getUsers,
    getUser,
    deleteUser,
    updatedUser,
    login
}