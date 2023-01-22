const modelo = require('../models/usuario');

const { subirNivelesPath } = require('../tools/paths');

exports.vistaMenu = (req, res) => {
    res.sendFile(subirNivelesPath(__dirname, 1)+'/views/public/html/menu.html');
}