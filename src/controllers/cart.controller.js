const User = require('../models/user.model');

const addCart = async (req,res) => {
    try{
        const { idUser } = req.params;
        const { productId } = req.body;
        console.log("Body: ", req.body);
    
        const user =  await User.findById({_id:idUser});
        let cart = {
            "product": productId,
            "cantidad": 1
        }
    
        if(user){
            for(let i= 0; i<user.carrito.length; i++)
            {
                if(user.carrito[i].product === productId)
                {
                    let cartMore = {
                        "product": productId,
                        "cantidad": user.carrito[i].cantidad+1
                    }
                    user.carrito[i] = cartMore;
                    await user.save();
                    return res.json(user);
                }
            }
            user.carrito.push(cart);
            await user.save();
            return res.json(user);
        }
    }catch(error){
        res.json({error: error})
    }    
}
const updateItem = async (req, res) => {
    try {
        const { idUser } = req.params;
        const { product } = req.body;
        console.log("idUser: "+ idUser);
        console.log("product: "+ product)

        let user = await User.findById({_id:idUser});
        
        if(!user)
            return res.json({msg: "No se encontro el usuario"});

        for(let i = 0; i<user.carrito.length; i++)
        {
            if(user.carrito[i].product == product.product)
                user.carrito[i] = product;
        }
        await user.save();
        res.json({msg:'Carrito actualizado'});
    } catch (error) {
        res.json({error: error});
    } 
}
const deleteItem = async (req,res) => {
    try {
        const { idUser } = req.params;
        const { productId } = req.body;

        let user = await User.findById({_id:idUser});
        
        if(!user)
            return res.json({msg: "No se encontro el usuario"});

        for(let i = 0; i<user.carrito.length; i++)
        {
            if(user.carrito[i].product == productId)
                user.carrito.splice(i, 1)
        }
        await user.save();
        res.json({msg:'Eliminado'});
    } catch (error) {
        res.json({error: error});
    }    
}

module.exports = {
    addCart,
    updateItem,
    deleteItem
}