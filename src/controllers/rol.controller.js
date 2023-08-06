const Rols = require('../models/rol.model')
const Status = require('../models/status.model');

let initialize = async (req, res) => {
    let rolAdmin = new Rols();
    rolAdmin.nombre = "ADMIN";
    let existRolAdmin = await Rols.findOne({nombre: rolAdmin.nombre});
    if(!existRolAdmin){
        await rolAdmin.save();
    }
    let rolUser = new Rols();
    rolUser.nombre = "USER";
    let existRolUser = await Rols.findOne({nombre: rolUser.nombre});
    if(!existRolUser){
        await rolUser.save();
    }
    let statusActive = new Status();
    statusActive.status = "ACTIVE";
    let existStatusActive = await Status.findOne({status: statusActive.status});
    if(!existStatusActive){
        await statusActive.save();
    }
    let statusCanceled = new Status();
    statusCanceled.status = "CANCELED";
    let existStatusCanceled = await Status.findOne({status: statusCanceled.status});
    if(!existStatusCanceled){
        await statusCanceled.save();
    }
    res.json({mensaje: "Inicialización completada"});
};

module.exports = {
    initialize
};