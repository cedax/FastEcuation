const modelo = require('../models/usuario');

exports.obtenerDatos = (req, res) => {
    modelo.find({}, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
}

exports.insertData = (req, res) => {
    const data = new modelo(req.body);
    data.save((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
}