const express = require('express');
const router = express.Router();

const controlador = require('../controllers/usuario');

const path = 'usuarios';

// Ruta user GET
router.get(`/${path}`, controlador.obtenerDatos);

module.exports = router;