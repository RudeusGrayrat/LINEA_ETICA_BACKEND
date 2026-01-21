const { Router } = require("express");
const postUsuario = require("../controllers/Usuario/postUsuario");
const postDenuncia = require("../controllers/Denuncia/postDenuncia");


const router = Router();

router.post("/postUser", postUsuario);
router.post("/postDenuncia", postDenuncia);

module.exports = router;
