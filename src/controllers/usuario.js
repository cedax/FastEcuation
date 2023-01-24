const modeloUsuario = require('../models/usuario');

exports.obtenerDatos = (req, res) => {
    modeloUsuario.find({}, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
}

exports.insertData = (req, res) => {
    const data = new modeloUsuario(req.body);
    data.save((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
}