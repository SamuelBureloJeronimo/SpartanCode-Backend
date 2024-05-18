const mongoose = require('mongoose');
const Address = require('../models/address.model');
const Users = require('../models/user.model');
const ObjectId = mongoose.Types.ObjectId;

let createAddress = async (req, res) => {
    let address = new Address();//modelo
    try
    {
        const {idUser} = req.params;
        let user = await Users.findById(idUser);
        //Case 0:
        if (!user) {
            return res.json({ msg: 'El usuario no existe' });
        }
        address._id = new ObjectId();
        address.nombreRef = req.body.nombreRef;
        address.cp = req.body.cp;
        address.estado = req.body.estado;
        address.municipio = req.body.municipio;
        address.colonia = req.body.colonia;
        address.calle = req.body.calle;
        address.nExterior = req.body.nExterior;
        address.nInterior = req.body.nInterior;
        address.calleRef1 = req.body.calleRef1;
        address.calleRef2 = req.body.calleRef2;
        address.Tel = req.body.Tel;
        address.descripcionDomicilio = req.body.descripcionDomicilio;

        user.addresses.push(address._id);

        let userUpdate = {
            addresses: user.addresses
        }

        await Users.findByIdAndUpdate({_id: idUser}, userUpdate);
        await address.save();
        //await address.save(); //Guarda la colecion en la BD
        res.json({message: '¡Dirección guardada!'}).status(200);
        
    } catch (error) {
        res.status(404).json({'error': error.message});
    }
}

let getAddressByUser = async (req, res) => {
    try {
        const {idUser} = req.params;
        let user = await Users.findById(idUser).populate("addresses");
        //Case 0:
        if (!user) {
            return res.json({ msg: 'El usuario no existe' });
        }
        res.json(user.addresses).status(200);
    } catch (error) {
        res.json({ mensaje: error.message });
    }
}

let changeAddress = async (req, res) => {
    try {
        const {idUser} = req.params;
        let user = await Users.findById(idUser);
        //Case 0:
        if (!user) {
            return res.json({ msg: 'El usuario no existe' });
        }
        user.addresses = req.body.address;

        let userUpdate = {
            addresses: user.addresses
        }

        await Users.findByIdAndUpdate({_id: idUser}, userUpdate);
        //await address.save(); //Guarda la colecion en la BD
        res.json({message: '¡Dirección guardada!'}).status(200);
    } catch (error) {
        res.json({ mensaje: error.message });
    }
}

module.exports = {
    createAddress,
    getAddressByUser,
    changeAddress
}