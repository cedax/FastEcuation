const express = require('express');
const router = express.Router();

const controlador = require('../controllers/sala-espera');

const path = 'sala-de-espera';

// Ruta user GET
router.get(`/${path}`, controlador.salaEspera);

module.exports = router;