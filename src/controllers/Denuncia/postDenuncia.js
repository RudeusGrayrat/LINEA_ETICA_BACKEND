const Denuncia = require("../../models/Denuncia");
const Usuario = require("../../models/Usuario");
const generarCorrelativa = require("./correlativa");
const enviarCorreo = require("./enviarCorreo");
const fs = require("fs");
const path = require("path");
const { FRONTEND_URL } = process.env;
const postDenuncia = async (req, res) => {
    try {
        const { fieldname, originalname,
            encoding, mimetype, size, buffer
        } = req.file || {};
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
        if (req.file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/mp4'];
            if (!allowedTypes.includes(mimetype)) {
                return res.status(400).json({ message: "Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG, MP4, archivos PDF y WORD.", type: "Error" });
            }
            if (size > 15 * 1024 * 1024) {
                return res.status(400).json({
                    message: "El archivo excede los 15MB",
                    type: "Error",
                });
            }
            const extension = path.extname(originalname);
            const safeFileName = `${codigoDenuncia}-${Date.now()}${extension}`;
            const uploadPath = "/home/miguelnc/storage/lineaetica/denuncias";
            const fullPath = path.join(uploadPath, safeFileName);
            fs.writeFileSync(fullPath, buffer);
            const fileUrl = `${FRONTEND_URL}/denuncias/${safeFileName}`;
            denuncia.archivo = {
                nombre: originalname,
                url: fileUrl,
                tipo: mimetype,
                size
            };

            await denuncia.save();

        }
        //enviar por correo al jefe predeterminado
    await enviarCorreo(process.env.CORREO_ADMIN, denuncia, usuario, "ADMIN")

        return res.status(201).json({
            message: `Denuncia creada exitosamente${anonimo ? ' de forma anónima.' : '.'}`,
            type: "Correcto",
        });
    } catch (error) {
        console.error("Error al crear la denuncia:", error);
        res.status(500).json({ message: error.message, type: "Error" });
    }
};

module.exports = postDenuncia;