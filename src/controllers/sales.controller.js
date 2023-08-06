const Sales = require('../models/sales.model');
const Product = require('../models/product.model');

let createSale = async (req, res) => {
    try {
        let sale = new Sales();
        sale.user = req.body.user;
        sale.articulo = req.body.articulo;
        sale.cantidad = req.body.cantidad;

        const product = await Product.findById(req.body.articulo);

        if (product) {

            if (product.cantidad > 0 && product.cantidad >= sale.cantidad) {
                sale.total = sale.cantidad * product.precio;
                product.cantidad -= sale.cantidad;
                sale.status = true;

                await product.save();
                await sale.save();
                res.json({ message: 'Nueva venta realizada' }).status(200);
            } else {
                res.json({ message: 'No hay articulos suficientes para vender' });
            }
        } else {
            res.json({ message: 'No se encontro el articulo' });
        }
    } catch (error) {
        res.status(404).json({ message: `Hubo un error con la compra ${error.message}` });
    }
}

let cancelSale = async (req, res) => {
    try {
        let sale = await Sales.findById(req.params.id);
        let articulo = await Product.findById(sale.articulo);

        if (sale) {
            if (sale.status != false) {
                articulo.cantidad += sale.cantidad;
                deleted_sale = await Sales.findByIdAndUpdate(sale, req.body);
                sale.status = false;

                await sale.save();
                await articulo.save();
                res.status(200).json({ mesage: 'Venta cancelada con éxito', nombre: deleted_sale });
            } else{
                res.json({ message: 'La compra ya ha sido cancelada' });
            }
        } else {
            res.json({ message: 'La compra no se encuentra' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Ocurrió un error inesperado al eliminar la venta' });
    }
}

let getSales = async (req, res) => {
    let sales = await Sales.find().populate('articulo');
    res.json(sales);
}

let getSale = async (req, res) => {
    try {
        let { id } = req.params;
        let sale = await Sales.findById(id).populate('articulo status');
        if (sale)
            res.status(200).json(sale);
        else
            res.json({ msg: "No se encontro esta compra" });
    } catch (error) {
        res.json({ mensaje: error.message });
    }
}

module.exports = {
    createSale,
    cancelSale,
    getSales,
    getSale
}