const Category = require('../models/category.model');

let createdCategory = async(req,res) =>{
    try{
        let category = new Category();

        let { nombre } = req.body;

        let exists_nombre = await Category.findOne({nombre});

        if(exists_nombre){
            res.json({mensaje:'la categoria ya existe'});
        }else{
            category.nombre = req.body.nombre;
            category.descripcion = req.body.descripcion;
    
            await category.save();
            res.json({mensaje:"Categoria registrada con exito!!"});
        }
    }catch(error){
        res.json({mensaje:error.message});
    }
}

let getCategories = async (req,res) =>{
    try{
        let categories = await Category.find();
        res.status(200).json(categories);
    }catch(error){
        res.json({mensaje:error.message});
    }
}

let getCategorie = async(req,res) => {
    try{
        let { id } = req.params;
        let categorie = await Category.findById(id);

        if(categorie){
            res.status(200).json(categorie);
        }else{
            res.json({mensaje:'no se encuentra esa categoria'});
        }

    }catch(error){
        res.json({mensaje:error.message});
    }
}

let deleteCategorie = async(req,res) => {
    try{
        let { id } = req.params;
        let exists = await Category.findOne({_id:id});

        if(exists){
            let categorie = await Category.findByIdAndDelete({_id:id});
            res.status(200).json({mensaje:'categoria eliminada',categorie});
        }else{
            res.json({ mensaje: "no hay categoria que eliminar" });
        }

    }catch(error){
        res.json({mensaje:error.message});
    }
}

let updatedCategorie = async(req,res) => {
    try{
        let { id } = req.params;
        let updated_category = req.body;

        let updated_data = await Category.findByIdAndUpdate(id,updated_category);

        res.json({mensaje:'categoria actualizada con exito!!',updated_data,changes:updated_category});

    }catch(error){
        res.json({mensaje:error.message});
    }
}


module.exports = {
    createdCategory,
    getCategories,
    getCategorie,
    deleteCategorie,
    updatedCategorie
}