// Librerias y configuracion inicial
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const initDB = require('./config/db');
const SocketIo = require('./eventos-servidor');

// Configuracion para que postman pueda enviar peticiones
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas de la aplicacion
const usuarioRutas = require('./routes/usuario');
const menuRutas = require('./routes/menu');
const salaEspera = require('./routes/sala');

app.use(usuarioRutas);
app.use(menuRutas);
app.use(salaEspera);

// Directorio con los archivos estaticos de la aplicacion
app.use('/static', express.static(__dirname + '/views'));

// Iniciar el servidor
server.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');

    // Iniciar la conexion a la base de datos
    initDB();

    // Iniciar los eventos de socket.io
    SocketIo.eventosSocketIo(io);
});