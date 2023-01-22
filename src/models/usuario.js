const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true,
        unique: true,
        minlength: 6
    },
    puntos: {
        type: Number,
        required: true,
        default: 0
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    }
});

module.exports = mongoose.model('usuario', UsuarioSchema);