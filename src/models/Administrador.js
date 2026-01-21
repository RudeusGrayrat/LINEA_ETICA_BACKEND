const { default: mongoose } = require("mongoose");

const administradorSchema = mongoose.Schema({
    nombres: {
        type: String,
        required: true,
    },
    apellidos: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);
const Administrador = mongoose.model("Administrador", administradorSchema);
module.exports = Administrador;