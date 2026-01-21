const { default: mongoose } = require("mongoose");

const denunciaSchema = mongoose.Schema({
    anonimo: {
        type: Boolean,
        required: true,
    },
    codigoDenuncia: {
        type: String,
        required: false,
        unique: true,
    },
    denunciante: {
        relacionCompania: {
            type: String,
            required: true,
        },
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
        },
        correo: {
            type: String,
            required: true,
        },
    },
    categoriaDenuncia: {
        type: String,
        required: true,
    },
    pais: {
        type: String,
        required: true,
        default: "PERU",
    },
    sede: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    involucrados: {
        type: String,
        required: true,
    },
    lugarHechos: {
        type: String,
        required: true,
    },
    descripcionHechos: {
        type: String,
        required: true,
    },
    fechaHechos: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
        default: "PENDIENTE",
    }
}
    , { timestamps: true }
);
const Denuncia = mongoose.model("Denuncia", denunciaSchema);
module.exports = Denuncia;