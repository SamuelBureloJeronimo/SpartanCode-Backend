const express = require('express');
const router = express.Router();
const keys = require('../settings/keys')
const settingToken = require('../settings/setting.token')

router.get("/validate-token", (req, res) => {
    try {
        const token = req.headers.authorization;
        const datosToken = settingToken.validarToken(token, keys.key1);

        // El token es válido, realiza las acciones necesarias
        return res.json({msg: "El token es valido", datosToken})
      } catch (error) {
        // El token es inválido o ha expirado
        return res.json({error: "El token es invalido"})
        // ...
      }
});

module.exports = router;
