const Product = require('../models/product.model');
const fs = require('fs');
const ProductPath = 'product/img/';
const path = require('path');


const createProduct = async(req, res) => {
    try{
        let ext = path.extname(req.file.originalname);
        // --- Guarda los datos dados en el modelo
        const product = new Product();
        product.nombre = req.body.nombre;
        product.precio = req.body.precio;
        product.descripcion = req.body.descripcion;
        product.categoria = req.body.categoria;
        product.marca = req.body.marca;
        product.cantidad = req.body.cantidad;
        product.modelo = req.body.modelo;
        
        let existProduct = await Product.findOne({modelo: product.modelo});
        //Case 0: Si el modelo ya existe elimina el archivo temporal y retorna la respuesta
        if (existProduct){
            fs.unlink(req.file.path, err2 => 
                { if(err2) return res.json({msg: 'Error al eliminar la imagen temporal'});})
            return res.json({msg: `El modelo ${product.modelo} ya existe en la base de datos`});
        }
        
        const tempPath = req.file.path; // ruta temporal del archivo cargado
        const targetPath = 'public/'+ProductPath+req.body.modelo+ext; // ubicación final deseada
        
        //Guarda la ruta de la imagen con el modelo
        product.imagen = ProductPath+req.body.modelo+ext;

        //Case 1: Si la marca no existe guarda la coleccion
        move_renameImage(tempPath, targetPath)

        // --- Guarda el producto
        console.log(product)
        await product.save();
        res.json({msg: 'Producto guardado con exito'});
        
    }catch(error){
        res.json({error: error.message});
    }

}

const getProducts = async (req, res) => {
    try{
        let products = await Product.find().populate('categoria marca');
        res.json(products);
    }catch(err){
        res.json({msg: 'Hubo un error al obtener los productos: ${err.message}'});
    }
}

const getProduct = async (req, res) => {
    try{
        //Viene de los parametros requeridos
        let { id } = req.params;
        let product = await Product.findById(id).populate('categoria marca');

        //Verifica si el producto existe o no. Si no existe entra aqui:
        if(!product)
            return res.json({msg: 'Este producto no existe'});

        //Si el producto existe entonces entra aqui
        res.json(product);
    }catch(err){
        res.json({msg: 'Hubo un error al consultar el producto: ${err.message}'});
    }
}

const updateProduct = async (req, res) => {
    try {
        //Parametro requerido para actualizar el producto
        let { id } = req.params;

        //Modelo de productos
        let productModel = {
            nombre: req.body.nombre,
            precio: req.body.precio,
            descripcion: req.body.descripcion,
            categoria: req.body.categoria,
            marca: req.body.marca,
            cantidad: req.body.cantidad,
            modelo: req.body.modelo
        }

        //Hace la busqueda del producto por el ID
        let product = await Product.findOne({_id: id});

        //Case 0: Si el producto no existe manda esta respuesta
        if (!product){
            //Si manda una imagen la elimina de la carpeta temps/
            if(re.file != null)
                deleteImage(req.file.path)
            //Si elimina la imagen correctamente en caso de que alla mandado manda esta respuesta
            return res.status(400).json({ mensaje: 'El producto no existe.' });
        }

        //Case 1: Si cambia el modelo verifica que no exista
        if(productModel.modelo != product.modelo){
            let existModel = await Product.findOne({modelo: productModel.modelo});
            //Case 0: Si el modelo ya existe elimina el archivo temporal y retorna la respuesta
            if (existModel){
                fs.unlink(req.file.path, err2 => 
                    { if(err2) return res.json({msg: 'Error al eliminar la imagen temporal'});})
                return res.json({msg: `El modelo ${productModel.modelo} ya existe en la base de datos`});
            }
        }
        
        // --- Variables que contendran la ruta temporal y final
        let tempPath;
        let targetPath;
        
        //Case 1: Si no manda imagen y no cambia de modelo, manda todo de una vez
        if (req.file == undefined && req.body.modelo == undefined)
        {
            let data_updated = await Product.findByIdAndUpdate({_id: id}, productModel);
            return res.status(200).send({ mensaje: 'Producto actualizado con exito!!', data_updated, changes: productModel });
        }
        //Case 2: Si no manda imagen y cambia de modelo, solo se renombra
        if (req.file == null && req.body.modelo != undefined)
        {
            let ext = path.extname(product.imagen);
            // --- Obteniendo los valores a ocupar
            tempPath = product.imagen; // ruta temporal del archivo cargado
            targetPath = ProductPath + productModel.modelo + ext; // ubicación final deseada
        }
        //Case 3: Si manda imagen y no cambia de modelo, solo se remplaza la imagen
        else if (req.file != null && req.body.modelo == undefined)
        {
            let ext = path.extname(req.file.path);
            // --- Obteniendo los valores a ocupar
            tempPath = req.file.path; // ruta temporal del archivo cargado
            targetPath = ProductPath + product.modelo + ext; // ubicación final deseada
        }
        //Case 4: Si manda imagen y cambia de modelo
        else if (req.file != null && req.body.modelo != undefined)
        {
            let ext = path.extname(req.file.path);
            // --- Obteniendo los valores a ocupar
            tempPath = req.file.path; // ruta temporal del archivo cargado
            targetPath = ProductPath + req.body.modelo + ext; // ubicación final deseada
            // --- Elimina la imagen con el nombre anterior
            deleteImage('public/'+product.imagen)
        }

        productModel.imagen = targetPath;
        //Verifica que renombra el archivo correctamente
        move_renameImage(tempPath,'public/'+targetPath)

        //Manda la actualizacion a la Base de datos
        let productUpdated = await Product.findByIdAndUpdate({_id: id}, productModel);
        //Respuesta
        res.status(200).send({ msg: '¡Producto actualizado con exito!', data_updated: productUpdated, changes: productModel });
    } catch(error){
        res.status(404).json({ msg: error.message});
    }
}

const deleteProduct = async (req, res) => {
    try{
        let { id } = req.params;
        let product = await Product.findOne({_id: id});

        //Verifica que el producto exista
        if(!product)
            return res.json({msg: 'El producto no existe'});

        // Elimina la imagen que corresponde al producto
        deleteImage('public/'+product.imagen);

        //Manda solicitud de delete a la base de datos
        await Product.findByIdAndDelete(id);
        res.json({msg: 'El producto ha sido eliminado', articulo: product});
        
    }catch(err){
        res.json({msg: 'Hubo un error al eliminar el producto: ${err.message}'});
    }
}

const searchProduct = async (req,res)=>{
    try{
        let { name } = req.params; //Obtengo el parametro 'name'
        name = removeAccents(name); // Elimino los acentos

        // Hago una busqueda de todo los productos
        let products = await Product.find().populate('categoria marca');
        let searchFinal = []; //Aqui almacenare la coincidencias
        
        //Recorre todo los productos
        for(let i=0; i<products.length; i++){
            //Si contiene la palabra buscada lo almcena
            if(removeAccents(products[i].nombre).includes(name)){
                searchFinal.push(products[i]);
            }
        }
        //Response
        res.json({msg: "Productos encontrados", searchFinal});
    }catch(error){
        res.json({error: `Error al buscar los productos: ${error.message}`});
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
function removeAccents(str) {
   return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    searchProduct
}