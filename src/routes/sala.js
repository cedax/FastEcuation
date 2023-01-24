const express = require('express');
const router = express.Router();

const controlador = require('../controllers/sala');

const path = 'sala';

// Ruta user GET
router.get(`/${path}`, controlador.salaEspera);

// Ruta crear POST
router.post(`/${path}/crear`, controlador.crearSala);

// Ruta verificar GET
router.get(`/${path}/verificar/`, controlador.verificarSala);

// Ruta agregar-jugador GET
router.get(`/${path}/agregar-jugador/`, controlador.agregarJugador);

// Ruta eliminar-jugador GET
router.get(`/${path}/eliminar-jugador/`, controlador.eliminarJugador);

module.exports = router;