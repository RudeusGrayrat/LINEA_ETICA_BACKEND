const Denuncia = require("../../models/Denuncia");
const Usuario = require("../../models/Usuario");
const generarCorrelativa = require("./correlativa");
const enviarCorreo = require("./enviarCorreo");

const postDenuncia = async (req, res) => {
    try {
        const {
            anonimo,
            relacionCompania,
            cargo,
            nombres,
            apellidos,
            telefono,
            correo,
            categoriaDenuncia,
            pais,
            sede,
            area,
            involucrados,
            lugarHechos,
            descripcionHechos,
            fechaHechos
        } = req.body;

        //si anonimo es falso se crea la denuncia y se crear al usuario si existe si no solo se ecuentra su id y se registra a ese usuario con la denuncia , pero si anonimo es true se crea la denuncia sin datos del denunciante

        let usuario = null
        let denuncia = null

        if (!relacionCompania || !categoriaDenuncia || !pais || !sede || !area || !involucrados || !lugarHechos || !descripcionHechos || !fechaHechos) {
            return res.status(400).json({ message: "Faltan datos obligatorios para crear la denuncia.", type: "Error" });
        }

        const codigoDenuncia = await generarCorrelativa();

        if (anonimo === false) {
            // Find or create usuario

            usuario = await Usuario.findOne({ nombres, apellidos });

            if (!usuario) {
                usuario = await Usuario.create({
                    nombres,
                    apellidos,
                    cargo,
                    telefono,
                    correo
                });
            }
            // Create denuncia with usuario reference
            denuncia = await Denuncia.create({
                anonimo: false,
                codigoDenuncia,
                denunciante: {
                    relacionCompania,
                    correo,
                    usuario: usuario._id
                },
                categoriaDenuncia,
                pais,
                sede,
                area,
                involucrados,
                lugarHechos,
                descripcionHechos,
                fechaHechos,
            });
            //enviar por correo la confirmacion de la denuncia anonima
            await enviarCorreo(correo, denuncia, usuario, "DENUNCIANTE")
        } else {
            // Create anonymous denuncia without denunciante data
            denuncia = await Denuncia.create({
                denunciante: {
                    relacionCompania,
                    correo,
                },
                codigoDenuncia,
                anonimo: true,
                categoriaDenuncia,
                pais,
                sede,
                area,
                involucrados,
                lugarHechos,
                descripcionHechos,
                fechaHechos,
            });
        }

        //enviar por correo al jefe predeterminado
        await enviarCorreo("sistemas1@ladiamb.com.pe", denuncia, usuario, "ADMIN")

        res.status(201).json({
            message: `Denuncia creada exitosamente${anonimo ? ' de forma anónima.' : '.'}`,
            type: "Correcto",
        });
    } catch (error) {
        console.error("Error al crear la denuncia:", error);
        res.status(500).json({ message: error.message, type: "Error" });
    }
};

module.exports = postDenuncia;