const Brand = require('../models/brand.model');
const fs = require('fs');
const path = require('path');
const brandPath = 'brand/img/';

/************************************************************************************************/
let createBrand = async (req, res) => 
{
    try
    {
        let ext = path.extname(req.file.originalname);
        let exist = await Brand.findOne({nombre: req.body.nombre});
        //Case 0: Si la marca ya existe elimina el archivo temporal y retorna la respuesta
        if (exist) {
            deleteImage(req.file.path);
            return res.json({message: 'La marca ya se encuentra registrada'}).status(404);
        }
        
        const tempPath = req.file.path; // ruta temporal del archivo cargado
        const targetPath = brandPath+req.body.nombre+ext; // ubicación final deseada

        let brand = new Brand();//modelo
        brand.nombre = req.body.nombre;
        brand.logo = targetPath;

        //Case 1: Si la marca no existe se procede a mover el archivo de imagen
        move_renameImage(tempPath, 'public/'+targetPath);

        await brand.save(); //Guarda la colecion en la BD
        res.json({message: 'Nueva marca creada'}).status(200);
        
    } catch (error) {
        res.status(404).json({'error': error.message});
    }
}
/************************************************************************************************/
let getBrands = async (req, res) => 
{
    try{
        let brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error){
        res.status(404).json({"error": error.message});
    }
}
/************************************************************************************************/
let getBrand = async (req, res) => 
{
    try
    {
        let brand = await Brand.findById(req.params.id);
        //Case 0: Si no se encuentra retorna una respuesta
        if(!brand)
            return res.json({msg: 'No se encontro la marca'}).status(404);

        //Case 1: Si encuentra manda el Json       
        res.status(200).json(brand);
    } catch (error){
        res.status(404).json({"error": error.message});
    }
}
/************************************************************************************************/
let updateBrand = async (req, res) => {
    try{
        // --- Obteniendo los valores a ocupar
        let id = req.params.id;
        let brandModel = {
            nombre: req.body.nombre
        };
        let brand = await Brand.findOne({_id: id});
        

        //Case 0: Si no manda nombre se le asigna el por defecto
        if(brandModel.nombre == undefined)
            brandModel.nombre = brand.nombre;

        //Case 1: Si la marca no existe manda una respuesta
        if (!brand)
            return res.json({msg:'La marca a actualizar no existe'}).status(404);
        
        //Case 2: Si cambia el nombre verifica que no exista
        if(brandModel.nombre != brand.nombre){
            let existBrand = await Brand.findOne({nombre: brandModel.nombre});
            //Case 0: Si el modelo ya existe elimina el archivo temporal y retorna la respuesta
            if (existBrand){
                if(req.file != undefined) //Si manda imagen la elimina
                    deleteImage(req.file.path);
                return res.json({msg: `La marca ${brandModel.nombre} ya existe en la base de datos`});
            }
        }

        // --- Obteniendo los valores a ocupar
        let tempPath; // ruta temporal del archivo cargado
        let targetPath; // ubicación final deseada

        //Case 3: Si no manda archivo y no cambia de nombre
        if (req.file == undefined && brandModel.nombre == undefined) 
            return res.json({msg: 'Sin cambios'})

        //Case 4: Si no manda imagen pero si cambia de nombre
        else if(req.file == undefined && brandModel.nombre != undefined){
            let ext = path.extname(brand.logo);
            tempPath = brand.logo;
            targetPath =  brandPath+brandModel.nombre+ext;
        }
        //Case 5: Si manda archivo pero no cambia de nombre
        else if(req.file != undefined && brandModel.nombre == undefined){
            let ext = path.extname(req.file.originalname);
            tempPath = req.file.path;
            targetPath =  brandPath+brand.nombre+ext;
        }
        //Case 6: Si manda archivo y cambia de nombre
        else if(req.file != undefined && brandModel.nombre != undefined){
            let ext = path.extname(req.file.originalname);
            tempPath = req.file.path;
            targetPath =  brandPath+brandModel.nombre+ext;
            deleteImage('public/'+brand.logo);
        }
        
        // --- Mueve la imagen y la renombra segun sea el caso
        move_renameImage(tempPath, 'public/'+targetPath);
        brandModel.logo = targetPath;

        // --- Mando la actualización
        let updated_data = await Brand.findByIdAndUpdate(id, brandModel);
        res.json({msg: 'La marca se actualizó correctamente... ',updated_data,changes:(brandModel)}).status(200);
    } catch(error){
        res.status(404).json({"error": error.message});
    }
}

/************************************************************************************************/
let deleteBrand = async (req, res) => {
    try
    {
        let id = await Brand.findById(req.params.id);
        //Case 0: Si no existe la marca no se puede eliminar
        if(!id)
            return res.status(404).json({msg: 'No hay marca que eliminar'});
        
        //Case 1: Si existe entonces se elimina
        let deleted_brand = await Brand.findByIdAndDelete({_id: req.params.id});
        
        // --- Elimino la imagen que corresponde a la marca
        deleteImage('public/'+deleted_brand.logo);
        
        // --- Mando la respuesta
        res.status(200).json({msg: 'Marca eliminada', deleted_brand});
    } catch(error){
        res.json({"error": error.message}).status(404);
    }
}
/**********************************************************************************************/
function deleteImage(route)
{
    fs.unlink(route, err2 => { if(err2) return console.log("Error al eliminar la imagen: "+err2) });
}
function move_renameImage(route, newRoute)
{
    fs.rename(route, newRoute, err => { if(err) return console.log("Error al mover o renombrar la imagen: "+err) });
}
module.exports = {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand,
}