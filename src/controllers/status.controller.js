const Status = require("../models/status.model");

let createStatus = async (req, res) => {
    try {
        const exist = await Status.findOne({ status: req.body.status });

        if (exist) {
            res.json({ message: 'Status ya ha sido creado con anterioridad' });
        } else {
            let status = new Status();
            status.status = req.body.status;
            await status.save();
            res.json({ message: 'Status creado con exito!' }).status(200);
        }
    } catch (error) {
        res.status(404).json({ message: 'Hubo un error al crear el status' });
    }
}

let getStatus = async (req, res) => {
    try {
        let status = await Status.find();
        if (status) {
            res.json(status);
        } else {
            res.status(404).json({ message: 'No existe ningún status' });
        }
    } catch (error) {
        res.json({ message: 'Ocurrio un error al buscar status' });
    }
}

let removeStatus = async (req, res) => {
    try {
        let id = await Status.findById(req.params.id);
        if (id) {
            let deleted_statu = await Status.findByIdAndDelete({ _id: id });
            res.status(200).json({ message: 'deleted status', nombre: deleted_statu });
        } else {
            res.status(404).json({ message: 'Status not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'error deleting' });
    }
}

module.exports = { createStatus, getStatus, removeStatus }