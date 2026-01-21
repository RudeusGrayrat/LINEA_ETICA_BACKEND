const { default: mongoose } = require("mongoose");

const usuarioSchema = mongoose.Schema({
    nombres: {
        type: String,
        required: true,
    },
    apellidos: {
        type: String,
        required: true,
    },
    cargo: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);
const Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports = Usuario;