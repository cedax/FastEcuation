const express = require('express');
const router = express.Router();

const controlador = require('../controllers/sala-espera');

const path = 'sala';

// Ruta user GET
router.get(`/${path}`, controlador.salaEspera);

// Ruta crear POST
router.post(`/${path}/crear`, controlador.crearSala);

// Ruta verificar GET
router.get(`/${path}/verificar/`, controlador.verificarSala);

module.exports = router;