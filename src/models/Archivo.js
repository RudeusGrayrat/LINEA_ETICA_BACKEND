const { default: mongoose } = require("mongoose");

const archivoAdjuntoSchema = mongoose.Schema({
    nombreArchivo: {
        type: String,
        required: true,
    },
    tipoArchivo: {
        type: String,
        required: true,
    },
    ruta: {
        type: String,
        required: true,
    },
    denuncia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Denuncia",
        required: true,
    },
    tamano: {
        type: Number,
        required: true,
    },
},
    { timestamps: true }
);
const ArchivoAdjunto = mongoose.model("ArchivoAdjunto", archivoAdjuntoSchema);
module.exports = ArchivoAdjunto;