const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/get-axios/:id', async (req, res) => {
    try {
      let { id } = req.params;
        const response = await axios.get(`https://api.zippopotam.us/mx/${id}`);
        const data = response.data;
        
        res.json({data});
      } catch (error) {
        console.error('Error al obtener datos de dirección:', error);
      }
});

router.get('/get-municipios/:id', async (req, res) => {
  try {
    let { id } = req.params;
    const response = await axios.get(`https://apisgratis.com/cp/ciudades/?estado=${id}`);
    const data = response.data;

    res.json({data});
  } catch (error) {
    console.error('Error al obtener datos de dirección:', error);
  }
});

module.exports = router;