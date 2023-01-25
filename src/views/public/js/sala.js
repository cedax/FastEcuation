// Objeto que contiene los metodos de socket.io
var socket = io();

/************************ EVENTOS ************************/

// Se ejecuta cuando un nuevo jugador se une a la sala C_NuevoJugador
// Este evento escucha deberia estar en la sala de espera
socket.on('C_NuevoJugadorSala', function (msg) {
    // agregar html del nuevo jugador
    console.log(msg);
    // agregar a #jugadores html del jugador que abandono
    const htmlJugadores = $('#jugadores').html();
    $('#jugadores').html(`${htmlJugadores}
        <div class="jugador">
            <h4>${msg.nickname}</h4>
            <div class="respuestas">
                <div class="incorrecto">
                    <img class="bolita" src="./static/public/img/bolita.png" alt="">
                    <img class="tache" src="./static/public/img/equis.png" alt="">
                </div>
                <div class="correcto">
                    <img class="bolita" src="./static/public/img/bolita.png" alt="">
                    <img class="palomita" src="./static/public/img/palomita.png" alt="">
                </div>
            </div>
        </div>
    `);
});

// Se ejecuta cuando un jugador abandona la sala
// Este evento escucha deberia estar en la sala de espera
socket.on('C_JugadorAbandono', function (msg) {
    console.log(msg);
});

// Se ejecuta cuando hubo un error al unirse a una sala porque el nickname ya existe
socket.on('C_NicknameVerificado', function (msg) {
    if(msg.status){
        console.log(msg);
        //
    }else {
        alert(msg.message + " este error tambien puede ser causado por recargar la pagina");
        window.location.href = '/';
    }
});

let despejes;
// Se ejecuta cuando se inicia la partida
socket.on('C_IniciarPartida', function (msg) {
    despejes = msg;
    $('#despejeValor').html(msg.despejeUno.despeje);
    $('#respuesta').html(msg.despejeUno.respuesta);
    $('#numeroDespeje').html(msg.despejeUno.pregunta);
});

// C_FinalizarPartida
socket.on('C_FinalizarPartida', function (msg) {
    alert("La partida termino, gano el jugador: " + msg.nickname);
    window.location.href = '/';
});

/************************ LOGICA ************************/

// se ejecuta al cargar el documento
$(document).ready(function () {
    const data = window.location.search.split('data=')[1];
    socket.emit('S_UnirSala', data);

    $('#iniciarJuego').click(function () {
        socket.emit('S_IniciarPartida', data);
    });

    // Se ejecuta al cambiar el valor de #valorX
    $('#valorX').on('keyup', function(){
        const numeroDespeje = $('#numeroDespeje').html();
        const respuesta = parseInt($('#respuesta').html());
        
        if($('#valorX').val() == respuesta){
            try {
                $('#despejeValor').html(despejes[numeroDespeje].despeje);
                $('#respuesta').html(despejes[numeroDespeje].respuesta);
                $('#numeroDespeje').html(despejes[numeroDespeje].pregunta);
            } catch (e) {
                socket.emit('S_FinalizarPartida', data);
                return;
            }
        }
    });
});