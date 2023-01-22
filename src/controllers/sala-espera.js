const modelo = require('../models/usuario');

const { subirNivelesPath } = require('../tools/paths');

exports.salaEspera = (req, res) => {
    res.sendFile(subirNivelesPath(__dirname, 1)+'/views/public/html/sala-de-espera.html');
}