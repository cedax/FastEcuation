const modeloSala = require('../models/sala');

const { subirNivelesPath } = require('../tools/paths');

exports.salaEspera = (req, res) => {
    res.sendFile(subirNivelesPath(__dirname, 1)+'/views/public/html/sala.html');
}

exports.crearSala = (req, res) => {
    const data = new modeloSala(req.body);

    data.save((err, data) => {
        if (err) {
            res.status(500).send({
                status: false,
                message: 'Error al crear sala',
                error: err
            });
        } else {
            res.status(200).send({
                status: true,
                message: 'Sala creada',
                data: data
            });
        }
    });
}

exports.verificarSala = (req, res) => {
    const idSala = req.query.idSala;

    modeloSala.find({codigo: idSala}, (err, data) => {
        if (err) {
            res.status(404).send({
                status: false,
                message: 'Sala no encontrada',
                error: err
            });
        } else {
            try {
                if (data[0].codigo == idSala) {
                    res.status(200).send({
                        status: true,
                        message: 'Sala encontrada',
                        data: data[0]
                    });
                } else {
                    res.status(404).send({
                        status: false,
                        message: 'Sala no encontrada',
                        error: err
                    });
                }
            }catch (err){
                res.status(404).send({
                    status: false,
                    message: 'Sala no encontrada',
                    error: err
                });
            }
        }
    });
}

exports.agregarJugador = (req, res) => {
    const idSala = req.query.idSala;
    const nickname = req.query.nickname;
    const idSocket = req.query.idSocket;

    // obtener los usuarios de la sala
    modeloSala.find({codigo: idSala}, (err, data) => {
        if (err) {
            res.status(404).send({
                status: false,
                message: 'Error al buscar la sala',
                error: err
            });
        } else {
            try {
                // usuarios -> ['nickname:socketId']
                arrayUsuariosOriginal = data[0].usuarios;
                arrayUsuarios = [];
                arrayUsuariosOriginal.forEach(element => {
                    arrayUsuarios.push(element.split(':')[0]);
                });

                // Si nickname esta en la sala
                if (arrayUsuarios.includes(nickname)) {
                    res.status(200).send({
                        status: false,
                        message: 'El nickname ya existe en la sala',
                        error: data[0]
                    });
                }else {
                    // agregar nickname a data[0].usuarios
                    data[0].usuarios.push(nickname+':'+idSocket);
                    // actualizar la sala
                    modeloSala.updateOne({codigo: idSala}, data[0], (err, data) => {
                        if (err) {
                            res.status(500).send({
                                status: false,
                                error: err,
                                message: 'Error al actualizar la sala'
                            });
                        } else {
                            res.status(200).send({
                                status: true,
                                data: data,
                                message: 'Sala actualizada'
                            });
                        }
                    });
                }
            }catch (err){
                res.status(404).send({
                    status: false,
                    message: 'Ocurrio un error al tratar de unirse a la sala',
                    error: err
                });
            }
        }
    });
}

exports.eliminarJugador = (req, res) => {
    const idSala = req.query.idSala;
    const nickname = req.query.nickname;

    // obtener los usuarios de la sala
    modeloSala.find({codigo: idSala}, (err, data) => {
        if (err) {
            res.status(404).send({
                status: false,
                message: 'Error al buscar la sala',
                error: err
            });
        } else {
            try {
                // usuarios -> ['nickname:socketId']
                arrayUsuariosOriginal = data[0].usuarios;
                arrayUsuarios = [];
                arrayUsuariosOriginal.forEach(element => {
                    arrayUsuarios.push(element.split(':')[0]);
                });

                // Si nickname esta en la sala
                if (arrayUsuarios.includes(nickname)) {
                    // eliminar nickname a data[0].usuarios
                    data[0].usuarios.splice(arrayUsuarios.indexOf(nickname), 1);
                    // actualizar la sala
                    modeloSala.updateOne
                    ({codigo: idSala}, data[0], (err, data) => {
                        if (err) {
                            res.status(500).send({
                                status: false,
                                error: err,
                                message: 'Error al actualizar la sala'
                            });
                        } else {
                            res.status(200).send({
                                status: true,
                                data: data,
                                message: 'Sala actualizada'
                            });
                        }
                    });
                }
            }catch (err){
                res.status(404).send({
                    status: false,
                    message: 'Sala encontrada pero no se pudo eliminar el jugador',
                    error: err
                });
            }
        }
    });
}

exports.obtenerJugadores = (req, res) => {
    const idSala = req.query.idSala;

    // obtener los usuarios de la sala
    modeloSala.find({codigo: idSala}, (err, data) => {
        if (err) {
            res.status(404).send({
                status: false,
                message: 'Error al buscar la sala',
                error: err
            });
        } else {
            try {
                res.status(200).send({
                    status: true,
                    data: data[0].usuarios,
                    message: 'Sala encontrada'
                });
            }catch (err){
                res.status(404).send({
                    status: false,
                    message: 'Sala no encontrada',
                    error: err
                });
            }
        }
    });
}