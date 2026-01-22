const postArchivo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No se ha subido ningún archivo.", type: "Error" });
        }
        // Aquí puedes guardar la información del archivo en la base de datos si es necesario

        const fileUrl = `https://lineaetica.towerandtower.com.pe/denuncias/${req.file.filename}`;
        return res.status(200).json({ message: "Archivo subido correctamente.", fileUrl, type: "Success" });
    }
    catch (error) {
        console.error("Error al subir el archivo:", error);
        return res.status(500).json({ message: "Error interno del servidor al subir el archivo.", type: "Error" });
    }
};

module.exports = postArchivo;