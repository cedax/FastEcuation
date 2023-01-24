const axios = require('axios');

const eventosSocketIo = (io) => {
    io.on('connection', (socket) => {
        // Se ejecuta antes de que el socket abandone las salas a las que este unido
        socket.on("disconnecting", () => {
            let salaDelSocket = Array.from(socket.rooms)[0];
            socket.to(salaDelSocket).emit('C_JugadorAbandono', socket.id);
        });

        // Se ejecuta despues de que el socket abandone las salas a las que este unido
        socket.on("disconnect", () => {
            
        });

        socket.on('S_VerificaSala', (IdSala) => {
            axios.get('http://localhost:3000/sala/verificar', {
                params: {
                    idSala: IdSala
                }
            }).then(function (response) {
                socket.emit('C_SalaVerificada', response.data);
            }).catch(function (error) {
                socket.emit('C_SalaVerificada', error.response.data);
            });
        });

        socket.on('S_NuevaSala', (idSala) => {
            socket.leave(Array.from(socket.rooms)[0]);
            socket.join(idSala);

            axios.post('http://localhost:3000/sala/crear', {
                codigo: idSala
            }).then(function (response) {
                socket.emit('C_NuevaSala', response.data);
            }).catch(function (error) {
                if (error.code === 'ERR_BAD_RESPONSE') {
                    socket.emit('C_NuevaSala', 'Error al crear sala, reintentalo');
                } else {
                    socket.emit('C_NuevaSala', 'Error inesperado, contacte a soporte y proporcione el siguiente codigo: ' + error);
                }
            });
        });

        socket.on('S_UnirSala', (idSala) => {
            socket.leave(Array.from(socket.rooms)[0]);
            socket.join(idSala);
            //console.log(io.sockets.adapter.rooms.get(idSala));
            socket.to(idSala).emit('C_NuevoJugador', 'Nuevo jugador se unio a la sala');
        });
    });
}

exports.eventosSocketIo = eventosSocketIo;