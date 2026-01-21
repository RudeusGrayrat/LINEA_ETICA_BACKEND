const { default: mongoose } = require("mongoose");

const seguminetoSchema = mongoose.Schema({
    denuncia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Denuncia",
        required: true,
    },
    administrador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Administrador",
        required: true,
    },
    comentario: {
        type: String,
        required: true,
    },
    estadoActual: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);
const Seguimiento = mongoose.model("Seguimiento", seguminetoSchema);
module.exports = Seguimiento;