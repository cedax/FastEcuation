const axios = require('axios');
var CryptoJS = require("crypto-js");

const eventosSocketIo = (io) => {
    io.on('connection', (socket) => {
        // Se ejecuta antes de que el socket abandone las salas a las que este unido
        socket.on("disconnecting", () => {
            let salaDelSocket = Array.from(socket.rooms)[0];
            
            if(salaDelSocket.length < 5){
                socket.to(salaDelSocket).emit('C_JugadorAbandono', socket.id);

                // Usuario -> user:socket Todo: cambiar la ruta para ser mas especifica
                axios.get('http://localhost:3000/sala/eliminar-jugador', {
                    params: {
                        idSala: salaDelSocket,
                        nickname: socket.id
                    }
                }).then(function (response) {
                    console.log(response.data);
                }).catch(function (error) {
                    console.log(error);
                });
            }
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
                const datos = {
                    sala: response.data.data.codigo,
                    nickname: nickname
                }
                const datosBase64 = btoa(JSON.stringify(datos));
                const sha256Data = CryptoJS.AES.encrypt(datosBase64, "Sedax203").toString();
                
                /*
                var bytes  = CryptoJS.AES.decrypt(sha256Data, "Sedax203");
                var sha256DataDesencriptado = bytes.toString(CryptoJS.enc.Utf8);
                */
                socket.emit('C_SalaVerificada', {
                    status: true,
                    data: sha256Data,
                    sala: response.data.data.codigo
                });

            }).catch(function (error) {
                socket.emit('C_SalaVerificada', {
                    status: false,
                    error: error.response.data,
                });
            });
        });

        socket.on('S_NuevaSala', ({idSala, nickname}) => {
            axios.post('http://localhost:3000/sala/crear', {
                codigo: idSala
            }).then(function (response) {
                const datos = {
                    sala: response.data.data.codigo,
                    nickname: nickname
                }
                const datosBase64 = btoa(JSON.stringify(datos));
                const sha256Data = CryptoJS.AES.encrypt(datosBase64, "Sedax203").toString();

                socket.emit('C_NuevaSala', {
                    status: true,
                    data: sha256Data,
                    sala: response.data.data.codigo
                });
            }).catch(function (error) {
                socket.emit('C_NuevaSala', {
                    status: false,
                    error: error.response.data
                });
            });
        });

        socket.on('S_UnirSala', (data) => {
            const datosBase64 = CryptoJS.AES.decrypt(data, "Sedax203").toString(CryptoJS.enc.Utf8);
            const datos = JSON.parse(atob(datosBase64));
            const idSala = datos.sala;
            const nickname = datos.nickname;

            // Abandonar todas las salas
            const salas = Array.from(socket.rooms);
            for (let i = 0; i < salas.length; i++) {
                socket.leave(salas[i]);
            }

            // Unirse a la nueva sala
            socket.join(idSala);
            
            //console.log(io.sockets.adapter.rooms.get(idSala));

            axios.get('http://localhost:3000/sala/agregar-jugador', {
                params: {
                    idSala: idSala,
                    nickname: nickname,
                    idSocket: socket.id
                }
            }).then(function (response) {
                if(response.data.status){
                    // Enviar mensaje a todos los sockets de que se unio un nuevo jugador
                    console.log(nickname + ' se unio a la sala ' + idSala);
                    io.to(idSala).emit('C_NuevoJugadorSala', {
                        nickname: nickname
                    });
                    socket.emit('C_NicknameVerificado', response.data);
                }else {
                    // Si el nick ya existe, avisar al cliente
                    socket.emit('C_NicknameVerificado', response.data);
                }
            }).catch(function (error) {
                // Todo: Agregar un evento global que informe de errores huerfanos como este
                console.log(error.response.data.message);
            });
        });

        socket.on('S_IniciarPartida', (data) => {
            const datosBase64 = CryptoJS.AES.decrypt(data, "Sedax203").toString(CryptoJS.enc.Utf8);
            const datos = JSON.parse(atob(datosBase64));
            const idSala = datos.sala;
            const nickname = datos.nickname;

            // GET http://localhost:3000/sala/jugadores?idSala=83dl
            axios.get('http://localhost:3000/sala/jugadores', {
                params: {
                    idSala: idSala
                }
            }).then(function (response) {
                const jugadores = response.data.data;
                const todosJugadores = [];
                for (let i = 0; i < jugadores.length; i++) {
                    const jugador = jugadores[i].split(':');
                    todosJugadores.push(jugador[1]);
                }
                
                // Enviar mensaje a todos los sockets
                io.to(idSala).emit('C_IniciarPartida', {
                    despejeUno: {
                        despeje: "X3 + 2 = 8",
                        respuesta: "2",
                        pregunta: "despejeDos",
                    },
                    despejeDos: {
                        despeje: "80 - X4 = 60",
                        respuesta: "5",
                        pregunta: "despejeTres",
                    },
                    despejeTres: {
                        despeje: "X5 + 2 = 12",
                        respuesta: "2",
                        pregunta: "despejeCuatro",
                    },
                    despejeCuatro: {
                        despeje: "X6 - 8 = 10",
                        respuesta: "3",
                        pregunta: "despejeCinco",
                    },
                    despejeCinco: {
                        despeje: "X7 / 5 = 7",
                        respuesta: "5",
                        pregunta: "Final",
                    },
                });

            }).catch(function (error) {
                console.log(error.response.data.message);
            });

        });

        // Cuando se termino la partida
        socket.on('S_FinalizarPartida', (data) => {
            const datosBase64 = CryptoJS.AES.decrypt(data, "Sedax203").toString(CryptoJS.enc.Utf8);
            const datos = JSON.parse(atob(datosBase64));
            const idSala = datos.sala;
            const nickname = datos.nickname;

            io.to(idSala).emit('C_FinalizarPartida', {
                nickname: nickname
            });
        });
    });
}

exports.eventosSocketIo = eventosSocketIo;