const express = require('express');
const router = express.Router();

const controlador = require('../controllers/usuario');

const path = 'usuarios';

// Ruta user GET
router.get(`/${path}`, controlador.obtenerDatos);

// Ruta crear POST
router.post(`/${path}/crear`, controlador.insertData);

module.exports = router;