const { Router } = require("express");
const postUsuario = require("../controllers/Usuario/postUsuario");
const postDenuncia = require("../controllers/Denuncia/postDenuncia");
const upload = require("../utils/multer");


const router = Router();

router.post("/postUser", postUsuario);
router.post("/postDenuncia", upload.single("archivo"), postDenuncia);

module.exports = router;
