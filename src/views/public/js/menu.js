// Objeto que contiene los metodos de socket.io
var socket = io();

// Evento que se ejecuta despues de comprobar si el codigo de sala existe en el servidor
socket.on('C_VerificaSala', function (msg) {
    console.log(msg);
});

$('#btnPlay').click(function () {
    // Valor del input de codigo de sala
    let idSala = $('#idSala').val();
    
    // Si el usuario ha introducido un codigo de sala
    if (idSala.length > 0) {
        // Si codigo de sala es valido
        if (idSala.length < 4) {
            alert('El código de sala debe tener al menos 4 caracteres');
            return;
        }

        // Checar si el codigo de sala existe en el servidor
        socket.emit('S_VerificaSala', idSala);
    }

    // De no haber introducido un codigo de sala, se crea una sala nueva
    let codigoSala = Math.random().toString(36).substr(2, 4);
    socket.emit('S_NuevaSala', codigoSala);
});