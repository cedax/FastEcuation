const modeloSala = require('../models/sala');

const { subirNivelesPath } = require('../tools/paths');

exports.salaEspera = (req, res) => {
    res.sendFile(subirNivelesPath(__dirname, 1)+'/views/public/html/sala-de-espera.html');
}

exports.crearSala = (req, res) => {
    const data = new modeloSala(req.body);

    data.save((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
}

exports.verificarSala = (req, res) => {
    const idSala = req.query.idSala;

    modeloSala.find({codigo: idSala}, (err, data) => {
        if (err) {
            res.status(404).send({
                message: 'Sala no encontrada',
                error: err
            });
        } else {
            try {
                if (data[0].codigo == idSala) {
                    res.status(200).send(data[0]);
                } else {
                    res.status(404).send({
                        message: 'Sala no encontrada'
                    });
                }
            }catch (err){
                res.status(404).send({
                    message: 'Sala no encontrada'
                });
            }
        }
    });
}