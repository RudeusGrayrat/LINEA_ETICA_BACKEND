const postUsuario = async (req, res) => {
    try {
        const {
            nombres,
            apellidos,
            correo,
            rol } = req.body;

        // Aquí iría la lógica para crear un nuevo usuario en la base de datos
        // Por ejemplo, podrías usar un modelo de Mongoose para guardar el usuario

    }
    catch (error) {
        res.status(500).json({ message: error.message , type: 'Error'});
    }
};

module.exports = postUsuario;