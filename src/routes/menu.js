const express = require('express');
const router = express.Router();

const controlador = require('../controllers/menu');

const path = '';

// Ruta menu GET
router.get(`/${path}`, controlador.vistaMenu);

module.exports = router;