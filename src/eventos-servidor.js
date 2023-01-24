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

        socket.on('S_VerificaSala', ({codigo, nickname}) => {
            axios.get('http://localhost:3000/sala/verificar', {
                params: {
                    idSala: codigo
                }
            }).then(function (response) {
                response.data.nicknameNuevoJugador = nickname;
                socket.emit('C_SalaVerificada', response.data);
            }).catch(function (error) {
                socket.emit('C_SalaVerificada', error.response.data);
            });
        });

        socket.on('S_NuevaSala', (idSala) => {
            axios.post('http://localhost:3000/sala/crear', {
                codigo: idSala
            }).then(function (response) {
                socket.emit('C_NuevaSala', response.data);
            }).catch(function (error) {
                socket.emit('C_NuevaSala', response.data);
            });
        });

        socket.on('S_UnirSala', ({idSala, nickname}) => {
            // Abandonar la sala anterior -- Posible uso de for para abandonar todas las salas
            socket.leave(Array.from(socket.rooms)[0]);
            // Unirse a la nueva sala
            socket.join(idSala);
            
            //console.log(io.sockets.adapter.rooms.get(idSala));

            // Enviar mensaje a todos los sockets de la sala
            socket.to(idSala).emit('C_NuevoJugador', nickname + ' se unio a la sala');
        });
    });
}

exports.eventosSocketIo = eventosSocketIo;