// Objeto que contiene los metodos de socket.io
var socket = io();

/************************ EVENTOS ************************/

// Se ejecuta despues de comprobar si el codigo de sala existe en el servidor
socket.on('C_SalaVerificada', function (msg) {
    if (msg.status) {
        socket.emit('S_UnirSala', {idSala: msg.data.codigo, nickname: msg.data.nicknameNuevoJugador});
        // Redireccionar a la pagina de juego EN ESTE PUNTO SE UNIRA A UNA SALA YA CREADA
    }else {
        alert(msg.message);
    }
});

// Se ejecuta despues de crear una nueva sala
socket.on('C_NuevaSala', function (msg) {
    if(msg.status){
        // La sala se creo con exito
        socket.emit('S_UnirSala', {idSala: msg.data.codigo, nickname: msg.data.nicknameNuevoJugador});
        // Redireccionar a la pagina de juego EN ESTE PUNTO SE CREARA UNA SALA NUEVA
    }else {
        console.log(msg.message + ':' + msg.error);
    }
});

// Se ejecuta cuando hubo un error al unirse a una sala porque el nickname ya existe
socket.on('C_UnirSalaNicknameExistente', function (msg) {
    console.log(msg.message);
});

// Se ejecuta cuando un nuevo jugador se une a la sala C_NuevoJugador
// Este evento escucha deberia estar en la sala de espera
socket.on('C_NuevoJugadorSala', function (msg) {
    // agregar html del nuevo jugador
    console.log(msg);
});

// Se ejecuta cuando un jugador abandona la sala
// Este evento escucha deberia estar en la sala de espera
socket.on('C_JugadorAbandono', function (msg) {
    console.log(msg);
});

/************************ LOGICA ************************/

$('#btnPlay').click(function () {
    // Valor del input de codigo de sala
    let idSala = $('#idSala').val();
    // Valor del input de nickname
    let nickname = $('#nickname').val();
    
    // Si el usuario ha introducido un codigo de sala
    if (idSala.length > 0) {
        // Si codigo de sala es valido
        if (idSala.length < 4) {
            alert('El código de sala debe tener al menos 4 caracteres');
            return;
        }

        // Checar si el codigo de sala existe en el servidor
        socket.emit('S_VerificaSala', {codigo: idSala, nickname: nickname});
    }else {
        // De no haber introducido un codigo de sala, se crea una sala nueva
        let codigoSala = Math.random().toString(36).substr(2, 4);
        socket.emit('S_NuevaSala', {idSala: codigoSala, nickname});
    }
});