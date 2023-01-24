const mongoose = require('mongoose');
const usuarioModel = require('./usuario');

const SalaSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true
    },
    usuarios: {
        type: Array,
        required: true,
        default: []
    },
    estado: {
        type: String,
        required: true,
        default: 'espera'
    }
});

module.exports = mongoose.model('salas', SalaSchema);