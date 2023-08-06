const jwt = require("jsonwebtoken");

function validarToken(token, clvSecreta)
{
    try{
        //Verificar y decodificar el token
        const tokenVer = jwt.verify(token, clvSecreta);
        //Si el token es valido, devuelve decodificado
        return tokenVer;
    }catch(error){
        //EL token es invalido o a expirado
        throw new Error('Token ya expiro o es invalido.');
    }
}

function createToken(payload)
{
    const app = require('../app');
    const token = jwt.sign(payload, app.get('key'), { expiresIn: '1h'});
    return token;
}

module.exports = {
    createToken,
    validarToken
}