// Objeto que contiene los metodos de socket.io
var socket = io();

/************************ EVENTOS ************************/

// Se ejecuta despues de comprobar si el codigo de sala existe en el servidor
socket.on('C_SalaVerificada', function (msg) {
    if(msg.status){
        alert('Se ha creado una nueva sala con el código: ' + msg.sala);
        window.location.href = '/sala?data=' + msg.data;
    }else {
        console.log(msg.message + ':' + msg.error);
    }
});

// Se ejecuta despues de crear una nueva sala
socket.on('C_NuevaSala', function (msg) {
    if(msg.status){
        alert('Se ha creado una nueva sala con el código: ' + msg.sala);
        window.location.href = '/sala?data=' + msg.data;
    }else {
        console.log(msg.message + ':' + msg.error);
    }
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